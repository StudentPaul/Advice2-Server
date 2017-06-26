/**
 * Created by socio on 12/24/2016.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbConfig = require('./db');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

//connect to DB
mongoose.connect(dbConfig.url);

var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
                app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Advice2/dist')));

var passport = require('passport');
var expressSession = require('express-session');
//TODO - Why do we need this key?
app.use(expressSession({secret: 'mySecretKey', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);

routes = require('./routes/index.js')(passport);
app.use('/',routes);

app.use(function (req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

module.exports = app;