var path = require('path');
var express = require('express');
var logger = require('morgan');
var compression = require('compression');

var app = express();

app.use(logger('dev'));
app.use(compression());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use('/', require('./routes/index'));

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 86400000}));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404);
    res.render('404', {page: 'index'});
});

/// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        page: 'error',
        message: err.message,
        error: {}
    });
    console.log(err);
});

app.set('port', 5000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});