/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookModel = require('../models').bookModel

module.exports = (app) => {

  app.route('/api/books')

    // get all books in library
    .get( (req, res) => {
      bookModel.find().then( (books) => {
        res.json(books);
        return;
      });
    })

    // add book to library
    .post( (req, res) => {
      let title = req.body.title;

      // return response if no title provided
      if (!title) {
        res.json('missing required field title');
        return;
        
      } else {
        // add book to db and show to client
        let newBook = new bookModel({ title: title });
        newBook.save();
        res.json(newBook);
        return;
      };
   
    })
    
    .delete( (req, res) => {
      bookModel.deleteMany({}).then( () => {
          res.json('complete delete successful');
          return;
      });
    });



  app.route('/api/books/:id')
    
    // get book by id 
    .get( (req, res) => {
      let bookId = req.params.id;
      
      // check id is valid
      if (bookId.match(/^[0-9a-fA-F]{24}$/)) {

        // find book by id
        bookModel.findById(bookId).then( (book) => {

          // return response if id not in db
          if (!book) {
            res.json('no book exists');
            return;
            
          } else {
            // return book info to client
            res.json(book);
            return;
          };
          
        });
        
      } else {
        // return response if id not valid
        res.json('no book exists');
        return;
      };
      
    })

    // add comment to book
    .post( (req, res) => {
      let bookId = req.params.id;
      let comment = req.body.comment;

      // return response if comment not provided
      if (!comment) {
        res.json('missing required field comment');
        return;
      };

      // check if id is valid
      if (bookId.match(/^[0-9a-fA-F]{24}$/)) {

        // find book by id
        bookModel.findById(bookId).then( (book) => {

          // return response if id not in db
          if(!book) {
            res.json('no book exists');
            return;
            
          } else {
            // add comment to book and return info to client
            book.comments.push(comment);
            book.commentcount++;
            book.save();
            res.json(book);
            return;
          };
          
        });
        
      } else {
        // return response if id not valid
        res.json('no book exists');
        return;
      };

    })

    // delete book by id
    .delete( (req, res) => {
      let bookId = req.params.id;

      // check if id is valid
      if (bookId.match(/^[0-9a-fA-F]{24}$/)) {
        // find and delete book by id
        bookModel.findByIdAndDelete(bookId).then( (data) => {
  
          // return response if book not in db
          if (!data) {
            res.json('no book exists');
            return;
            
          } else {
            // return response if book deleted
            res.json('delete successful');
            return;
          };
          
        });
      } else {
        // return response if id not valid
        res.json('no book exists');
        return;
      };
      
    });
};
