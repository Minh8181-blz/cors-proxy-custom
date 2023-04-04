var createError = require('http-errors');
var express = require('express');
var request = request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function (req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
  if (req.method === 'GET' && req.path === "/ping") {
    res.send("ok");
    return;
  }

  if (req.method === 'OPTIONS') {
      // CORS Preflight
      res.send();
  } else {
      var key = req.header('X-Sapo-Access-Token');
      var url = "https://1992watches.mysapo.net" + req.url;
      request({ url: url, method: req.method, json: req.body, headers: {'X-Sapo-Access-Token': key} },
      function (error, response, body) {
          if (error) {
              console.error('error: ' + response.statusCode)
          }
      }).pipe(res);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
