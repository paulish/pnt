const path = require('path');
const express = require('express');
const logger = require('morgan');
const compression = require('compression');
const db = require('./lib/db');
const Updater = require('./lib/updater');

let app = express();

app.use(logger('dev'));
app.use(compression());

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use('/', require('./routes/index'));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    res.render('404', { page: 'index' });
});

/// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        page: 'error',
        message: err.message,
        error: {}
    });
    console.log(err);
});

let port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
let ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// let updater = new Updater('http://ratings.tankionline.com/get_stat/profile/', db);
// return updater.updatePlayers();

db.init(path.join(__dirname, 'tanki.sqlite'))
    .catch(err => console.error(err.message, err.stack))
    .then(() => {
        let server = app.listen(port, ip, function () {
            console.log('Express server listening on port ' + server.address().port);
        });
        console.log('Server running on http://%s:%s', ip, port);
    });

module.exports = app;