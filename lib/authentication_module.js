var expressSession = require('express-session');
var cfenv = require('../cfenv-wrapper');

module.exports = function (app, config) {

    // Initialize the cfenv wrapper
    var appEnv = cfenv.getAppEnv();

    //get Bluemix Credentials from Environment Variables to login to Bluemix CloudFoundry
    var envVars = appEnv.getEnvVars();
    global.BMX_USERNAME = envVars['BMX_USERNAME'];
    global.BMX_PASSWORD = envVars['BMX_PASSWORD'];
    //TODO: Pick Hostname for Env.
    var callback_url = "https://bluemix-admin.mybluemix.net/auth/sso/callback";

    // get Service Details. For running local, add VCAP_Services details to env.json file
    var VCAPServices = appEnv.getServices();
    for (var service in VCAPServices) {
        var obj = VCAPServices[service];
        if (obj.label == "SingleSignOn") {
            var ssoConfig = obj;
        } else if (obj.label == "cloudantNoSQLDB") {
            var cloudantConfig = obj;
        }
    }

    //Cloudant configuration
    if (cloudantConfig != null) {
        config.CloudantCreds = cloudantConfig.credentials;
    } else {
        console.error('Error: Cloudant Configuration not found in Environment variables. Ensure Cloudant DB Service has been added to app');
    }

    //SSO Configuration
    if (ssoConfig != null) {
        var client_id = ssoConfig.credentials.clientId;
        var client_secret = ssoConfig.credentials.secret;
        var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
        var token_url = ssoConfig.credentials.tokenEndpointUrl;
        var issuer_id = ssoConfig.credentials.issuerIdentifier;
    } else {
        console.error('Error: SSO Configuration not found in Environment variables. Ensure SSO Service has been added to app');
    }

    //Passport configuration
    var passport = require('passport');
    var openIdConnect = require('passport-idaas-openidconnect');
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
    global.passport = passport;
    app.get('/login', passport.authenticate('openidconnect', {}));

    config.ensureAuthenticated = function (req, res, next) {
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

    app.get('/hello', config.ensureAuthenticated, function (req, res) {
        res.send('Hello, ' + req.user['id'] + '!');
        console.log(req.user);
    });

    app.get('/failure', function (req, res) {
        res.send('Failure! Authentication failed');
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

}