var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var cors = require('cors')
var app = express();

app.use(cors())

var key = 'test front end developer';

// Create an encryptor: 
var encryptor = require('simple-encryptor')(key);

// DataBase 
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cruddb"
});
con.connect(function (err) {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

app.use(function (req, res, next) {
  req.encryptor = encryptor;
  req.con = con;
  next();
});
// var encrypted = encryptor.encrypt('testing');
// console.log('encrypted: %s', encrypted);

// var decrypted = encryptor.decrypt(encrypted);
// console.log('decrypted: %s', decrypted);

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());


// var index = require('./routes/index');
// var auth = require('./routes/auth');
var users = require('./routes/users');

// app.use('/', index);
// app.use('/api/', auth);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
