/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const expect = require('chai').expect;
//var MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const MONGODB_CONNECTION_STRING = process.env.DB;
const Schema = mongoose.Schema;

const Books = new Schema({
  title: String,
  comments: [{type: String}],
  commentcount: {
    type: Number,
    default: 0
  }
});

const Library = mongoose.model('book', Books);

mongoose.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
  if(err) throw(err)
  //console.log(db.db.databaseName);
  console.log('connected to: ' + db.db.databaseName);
});



module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Library.find({}, (err, book)=>{
        if(err) throw(err)
        res.json(book);
      })      
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(req.body.title){
        const book = new Library({
          title: req.body.title,
        })
        book.save((err, saved)=>{
          if(err) throw(err)
          res.json({_id: saved._id, title: saved.title});
        });
      } else {
        res.send('please enter title');
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Library.find({}, (err, books)=>{
        if(err) throw(err);
        if(books.length>1){
          books.forEach((book)=>{
            book.remove();
          })
        } else {
          res.send('cannot delete books');
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(req.params.id){
        Library.findOne({_id: bookid},(err, book)=>{
          if(err && err.reason != undefined) console.error(err);
          if(!book){
            //res.text = 'no book found';
            return res.send('no book exists');
          } else {
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comments
            })
          }
        })
      } else {
        res.send('please provide an id')
      }
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      if(comment){
        Library.findOne({_id: bookid}, (err, book)=>{
          if(err&&err.reason != undefined) throw(err);
          if(!book){
            res.send('no book found');
          } else {
            book.comments.push(comment);
            book.commentcount += 1;
            book.save((err, saved)=>{
              if(err) throw(err);
              res.json(saved);
            });
          }
        })
      } else {
        res.send('please fill in the comment field')
      }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Library.findOne({_id: bookid}, (err, book)=>{
        if(err) throw(err)
        if(book){
          book.remove((err, deleted)=>{
            res.send('delete successful');
          });
        }
      })
    });
  
};
