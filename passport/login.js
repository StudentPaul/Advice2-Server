/**
 * Created by socio on 12/24/2016.
 */

var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var Question = require('../models/question');
var Answer = require('../models/answer');
var DAO = require('../models/DAO')(User, Question, Answer);
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

  passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },DAO.findUser)
  );




}