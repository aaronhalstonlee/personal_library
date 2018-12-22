/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var newBookId;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        //console.log(res.text);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Help the Cats'})
          .end(function(err, res){
            //console.log(res.body._id)
            //newBookId = res.body._id
            assert.equal(res.status, 200);
            assert.property(res.body, 'title')
            assert.property(res.body, '_id')
            done();
            //console.log(res.body[0]);
          })
        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            //console.log(res.text);
            assert.equal(res.text, 'please enter title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            newBookId = res.body[0]._id;
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/:id')
          .query({_id: ''})
          .end(function(err, res){
            if(err) throw(err)
            //console.log(res.text);
            assert.equal(res.status, 200);
            //assert.equal(res.body[0]._id, newBookId);
            assert.equal(res.text, 'no book exists');
            
            done()
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' +newBookId)
          .query({_id: newBookId})
          .end(function(err, res){
            if(err) throw(err)
            assert.equal(res.status, 200);
            console.log(newBookId)
            assert.equal(res.body._id, newBookId);
            //assert.equal(res.text, 'no book found');
            done()
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + newBookId)
          .send({comment: 'new comment'})
          .end(function(err, res){
            if(err) console.log(err)
            assert.equal(res.status, 200);
            assert.property(res.body, 'comments');
            assert.isAtLeast(res.body.comments.length, 1, 'should have at least one comment')
            done()
          })
      });
      
    });

  });

});
