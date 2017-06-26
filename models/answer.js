/**
 * Created by socio on 12/25/2016.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Answer',{
  authorId: String,
  questionId: String,
  answer: String,
  date: Date,
  isVoteUp: Boolean
});