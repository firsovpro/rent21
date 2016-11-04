var express = require('express')
    , https = require('https')
    , http = require('http')
    , nconf = require('nconf')
    , path = require('path')
    , util = require('util')
    , everyauth = require('everyauth')
    , Recaptcha = require('recaptcha').Recaptcha
    , passport = require('passport')
    , YandexStrategy = require('passport-yandex').Strategy;

var YANDEX_CLIENT_ID = "a22a06f2b90e4f71875e95d64b233bfa"
var YANDEX_CLIENT_SECRET = "2a4b0efb70af405dacba5d3124f960ce";

var conectSql = require('../../../setings.json');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : conectSql.sqlconnect.user,
  password : conectSql.sqlconnect.password,
  database : conectSql.sqlconnect.db
});

var fs = require('fs');

var ArrayAdmin = ['firsovpro@yandex.ru'];
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new YandexStrategy({
    clientID: YANDEX_CLIENT_ID,
    clientSecret: YANDEX_CLIENT_SECRET,
    callbackURL: "https://vfirsov.ru:455/auth/yandex/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Yandex profile is returned
      // to represent the logged-in user.  In a typical application, you would
      // want to associate the Yandex account with a user record in your
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  connection.connect();

app.get('/', function(req, res){
//  var test = require('./modules/powerlevel')(connection);
//  console.log(conectSql);
  var outData = {};
  connection.query('SELECT * FROM `im_object` limit 0,40', function(err, rows, fields) {
    if (err) throw err;
    //console.log(rows);
    outData.bodyTable = rows;
      connection.query('SELECT * FROM `im_object` limit 100,40', function(err, rows, fields) {
        if (err) throw err;
        outData.spec = rows;
        res.render('index', { user: req.user ,test1:rows,Tables:outData,title:'Проверка'});
      });
  });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/layout', function(req, res){
  res.render('layout', { user: req.user });
});



app.post('/getjson', function(req, res) {
      var out={};
      if(req.body.opp=='getDZ') out.script =fs.readFileSync(__dirname+'/views/modules/editDZ.js').toString();
      if(req.body.opp=='getMARK') out.script =fs.readFileSync(__dirname+'/views/modules/editMARK.js').toString();
      if(req.body.opp=='getTRAFFIC') out.script =fs.readFileSync(__dirname+'/views/modules/editTRAFFIC.js').toString();
      if(req.body.opp=='feedback') out.script =fs.readFileSync(__dirname+'/views/modules/feedback.js').toString();
      if(req.body.opp=='replacement') out.script =fs.readFileSync(__dirname+'/views/modules/replacement.js').toString();
      out.in = req.body;
      res.json(out);
});



app.get('/auth/yandex',
  passport.authenticate('yandex'),
  function(req, res){
    // The request will be redirected to Yandex for authentication, so this
    // function will not be called.
  });

app.get('/auth/yandex/callback',
  passport.authenticate('yandex', { failureRedirect: '/' }),
  function(req, res) {
      if(ArrayAdmin.indexOf(req.user._json.default_email)!=-1){
          req.user.rolle="admin";
      }else{
          req.user.rolle="user";
      }
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

var server = https.createServer({
      key: fs.readFileSync('../../../key/vfirsov.ru.key'),
      cert: fs.readFileSync('../../../key/vfirsov.ru.crt')
    }, app).listen(455);


//var server = http.createServer(app).listen(455);

/*
var io = require('socket.io').listen(server);


io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 100);
});
*/
