var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const EventEmitter = require('events');
class ReadinessEventEmitter extends EventEmitter {}
global.readinessEventEmitter = new ReadinessEventEmitter();
global.config = require('config');
global.storage = require('./storage/mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var ticketsRouter = require('./routes/tickets');




var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);
app.use('/roles', rolesRouter);

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
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(3000, () => {
  console.log('listening...');
});

module.exports = app;
