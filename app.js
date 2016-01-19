var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cfenv = require('./cfenv-wrapper');
// Initialize the cfenv wrapper
var appEnv = cfenv.getAppEnv();

//bluemix service credentials
var bluemix = require('./config/bluemix');
//var creds = bluemix.getServiceCreds('service_name');

//define routes
var routes = require('./routes/index');
var cfapps = require('./routes/cfapps');
var api = require('./routes/api');
var mobileApp = require('./routes/mbapp');
var openIdConnect = require('passport-idaas-openidconnect');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//Passport configuration
var passport = require('passport');
var OpenIDConnectStrategy = openIdConnect.IDaaSOIDCStrategy;
//app.use(cookie-parser());
app.use(expressSession({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

//get Bluemix Credentials from Environment Variables to login to Bluemix CloudFoundry
var envVars = appEnv.getEnvVars();
global.BMX_USERNAME = envVars['BMX_USERNAME'];
global.BMX_PASSWORD = envVars['BMX_PASSWORD'];

// get SSO Service Details. For running local, add VCAP_Services details to env.json file
var VCAPServices = appEnv.getServices();
for (var service in VCAPServices) {
    var obj = VCAPServices[service];
    if (obj.label == "SingleSignOn") {
        var ssoConfig = obj;
    }
}
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;

var callback_url = "https://bluemix-admin.mybluemix.net/auth/sso/callback";

var OpenIDConnectStrategy = openIdConnect.IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
        authorizationURL: authorization_url,
        tokenURL: token_url,
        clientID: client_id,
        scope: 'openid',
        response_type: 'code',
        clientSecret: client_secret,
        callbackURL: callback_url,
        skipUserProfile: true,
        issuer: issuer_id
    },
    function (iss, sub, profile, accessToken, refreshToken, params, done) {
        process.nextTick(function () {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        })
    });

passport.use(Strategy);
app.get('/login', passport.authenticate('openidconnect', {}));

function ensureAuthenticated(req, res, next) {
    if (appEnv.isLocal) {
        return next();
    } else {
        if (!req.isAuthenticated()) {
            req.session.originalUrl = req.originalUrl;
            res.redirect('/login');
        } else {
            return next();
        }
    }
}

app.use('/', routes);
app.use('/cfapps', ensureAuthenticated, cfapps);
app.use('/api', ensureAuthenticated, api);
app.use('/mbapp', mobileApp);

app.get('/hello', ensureAuthenticated, function (req, res) {
    res.send('Hello, ' + req.user['id'] + '!');
    console.log(req.user);
});

app.get('/failure', function (req, res) {
    res.send('Failure! Authentication failed');
});

app.get('/auth/sso/callback', function (req, res, next) {
    var redirect_url = req.session.originalUrl;
    passport.authenticate('openidconnect', {
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

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
