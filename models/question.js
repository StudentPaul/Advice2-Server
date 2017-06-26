/**
 * Created by socio on 12/25/2016.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Question',{
  authorId: String,
  title: String,
  question: String,
  votesUp: Number,
  votesDown: Number,
  date: Date,
  bestAnswerId: String
});