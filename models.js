let mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
  title: {type: String, required: true},
  comments: {type: [String]},
  commentcount: {type: Number, default: 0}
});

let bookModel = mongoose.model('Book', bookSchema);

exports.bookModel = bookModel;