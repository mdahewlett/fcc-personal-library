/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', (done) => {
     chai.request(server)
      .get('/api/books')
      .end( (err, res) => {
        assert.equal(res.status, 200);
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

  suite('Routing tests', () => {

    let validId;
    let invalidId = [
      {id: 'shortId'},
      {id: 'thisisanidwtihlengthof24'}
    ]

    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', (done) => {
        chai
        .request(server)
        .post('/api/books')
        .send({ title: 'test' })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'test');
          assert.property(res.body, '_id');

          validId = res.body._id;
          
          done();
        });
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai
        .request(server)
        .post('/api/books')
        .send({})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, '"missing required field title"');
          done();
        });
      });
      
    });

    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books',  (done) => {
        chai
        .request(server)
        .get('/api/books')
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {

      invalidId.forEach( (data) => {
        test('Test GET /api/books/[id] with id not in db for ' + data.id, (done) => {
          chai
          .request(server)
          .get('/api/books/' + data.id)
          .end( (err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"no book exists"');
            done();
          });
        
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai
        .request(server)
        .get('/api/books/' + validId)            
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'test');
          assert.equal(res.body._id, validId);
          assert.isArray(res.body.comments);
          assert.equal(res.body.commentcount, res.body.comments.length);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai
        .request(server)
        .post('/api/books/' + validId)
        .send({ comment: 'test comment' })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'test');
          assert.equal(res.body._id, validId);
          assert.equal(res.body.commentcount, res.body.comments.length);
          assert.isArray(res.body.comments);
          assert.equal(res.body.comments[0], 'test comment');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai
        .request(server)
        .post('/api/books/' + validId)
        .send({})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, '"missing required field comment"');
          done();
        });
      });

      invalidId.forEach( (data) => {
        test('Test POST /api/books/[id] with comment, id not in db for ' + data.id, (done) => {
          chai
          .request(server)
          .post('/api/books/' + data.id)
          .send({ 
            id: data.id, 
            comment: 'comment sent with invalid id' 
          })
          .end( (err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"no book exists"');
            done();
          });
        });
      });
        
    });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
        .request(server)
        .delete('/api/books/' + validId)
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, '"delete successful"');
          done();
        });
      });

      invalidId.forEach( (data) => {
        test('Test DELETE /api/books/[id] with id not in db for ' + data.id, (done) => {
          chai
          .request(server)
          .delete('/api/books/' + data.id)
          .end( (err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"no book exists"');
            done();
          })
        });
      });
    });

  });

});

after(() => {
    chai.request(server).get('/api')
});