/**
 * Created by socio on 12/24/2016.
 */
var login = require('./login');
var User = require('../models/user');

module.exports = function(passport){

  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log('serializing user: ');console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('deserializing user:',user);
      done(err, user);
    });
  });

  // Setting up Passport Strategy for Login
  login(passport);

}