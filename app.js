var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

//Express Configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

global.config = {};
//Handle Bluemix and Passport Authentication
require('./lib/authentication_module')(app, global.config);

//Initialize Cloudant DB Connection
//var dbOpsFn = require('./lib/dbOps');
//var dbOps = new dbOpsFn();
var dbOps = new (require('./lib/dbOps'))();
dbOps.initDBConnection();

//Define Routes
app.use('/', require('./routes/index'));
app.use('/cfapps', config.ensureAuthenticated, require('./routes/cfapps'));
app.use('/api', config.ensureAuthenticated, require('./routes/api'));
app.use('/mbapp', require('./routes/mbapp'));
app.use('/test', require('./routes/test'));
app.use('/db', require('./routes/db'));

//Authentication and SSO Callback
app.get('/auth/sso/callback', function (req, res, next) {
    var redirect_url = req.session.originalUrl;
    global.passport.authenticate('openidconnect', {
        successRedirect: redirect_url,
        failureRedirect: '/failure',
    })(req, res, next);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
