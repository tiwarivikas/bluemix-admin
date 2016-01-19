/**
 * Created by vikas on 12/18/2015.
 */
var express = require('express');
var router = express.Router();
var rest = require('../node_modules/restler');

var csrfTokenValue = 'KMGtHG9J-tVigU4tIX_MJed8fWapWWUrIPo0';
var cookieValue= 'optimizelyEndUserId=oeu1434014156005r0.37958404002711177; videodesk=1ab24dd8-8a28-629a-a02e-82e4c209f9e0; cloudOE_view_id=%22list%22; __qca=P0-338973604-1442079459170; _pk_ref.12.721b=%5B%22%22%2C%22%22%2C1447064458%2C%22https%3A%2F%2Fwww-947.ibm.com%2FFIM%2Fsps%2FIBM_WWW_SAML20_EXTERNAL%2Fsaml20%2Flogininitial%3FRequestBinding%3DHTTPPost%26ResponseBinding%3DHTTPPost%26NameIdFormat%3DEmail%26PartnerId%3Dhttps%3A%2F%2Fidaas.ng.bluemix.net%2Fsps%2Fsaml20sp%2Fsaml20%22%5D; _pk_id.12.721b=6d0993836f5c49b7.1434014210.91.1447064458.1447064458.; CoreID6=59193919834614126688976&ci=50200000|BLUEMIX; BLUISS=2fb90b007b2411e0a9148f7a5307609b; CMAVID=70121438308053065109319; cmTPSet=Y; _ga=GA1.2.1686900252.1441368351; registration=1449751534714; __ngDebug=true; ace_client.sid=s%3A9gOT_laks-XW9EK3tu_e9SEroCq9faH3.svc0gebK4W29%2FpxiWeu7LE0zWWn4G1uRUgPI9svzu0s; com.ibm.bluemix.login.Identity.yp=1JTHacfjWKElieKokYj9QjIsOvrxpfbE3Fto7+3n+DzV5Mn9eHOVOm6kWu4oYPN1NqH3YurkF1WO8zRfAQrga5QHVBat+O+kceWOq1ky+vVHlv2YQnzgcUtaNc2jivvG5xqpYfD/0I5bfd3fK8RvFW9MwMG8uduTfO6pXHOnZUABEReNV3qhML0DZRJkDSgZRh52fUnwI7F6gQn+NFfhZoBV8sGi4Z7UsK6mGZeJDs3J0HdjqZ8S94j0ElEHV10RpIj1P/fMY2bURMFBKq+5ycGwUuX3IG6zEj5tCp9uBmJkNAOsBNP8EIqIr9cS/GZE0You23vXGM6P4+W8GMJa2rgXqNkdRk90nMZPqTYpBUcibteUGfsKls8mWk0Sre2E7y6bY6hqoxkDFtq1gYn9gA==; com.ibm.bluemix.login.Expiration.yp=1450876020; ace_login_status=%7B%22console%22%3A%7B%22state%22%3A%22login%22%2C%22user%22%3A%2218446254fcc29723ff9a6c57006ba0df677d4520daec4fe4c17c6038b999ee7a%22%7D%7D; ace_login_duration=1450789579973; cloudOE_orgGuid=%22da47effc-1c1f-4fd3-9ff0-d4868990faaf%22; ace_orgGuid=%22da47effc-1c1f-4fd3-9ff0-d4868990faaf%22; cloudOE_sectionOrder_v2=%5B%22appsSection%22%2C%22servicesSection%22%2C%22containersSection%22%2C%22vmsSection%22%5D; cloudOE_hiddenSectionOrder_v2=%5B%5D; cloudOE_spaceGuid=%2280a35050-fa98-4caf-bc26-9e9a518d4503%22; guidedExperienceIsOpen=false; Alchemy.cookie.session=s%3A3NQCp58LexJ3ACIAfvEyYtGoVmSNt7eC.5eHtFjEE4ZysuCOQKQ0OCyuO9r9SvO4m4VuJzZ%2Fzqvs; Proxy___VCAP_ID__=6aa7576194c64d7388b6ae8294b96e393783d4b6c24e41148106b15dd051d12e; Proxy_JSESSIONID=0000naQRI3ZfB0xkRYbZEP0Apsm:af3559a3-508d-48b5-9cb5-db1d07bad665; CoreM_State=45~-1~-1~-1~-1~3~3~5~3~3~7~7~|~3BF0FB71~01FB5FB4~F75070A4~|~~|~~|~|0~1~2|||||~|~~|~1446790296294~1446115547188~1446015804506~|~~|~~|~~|~~|~~|~; CoreM_State_Content=6~|~08A7CD4BDA83E0EE~95D95425574ABB76~6AD09FB870837DE0~D82C5302AB7CB9B1~940D01CC202E7C89~EA14CC6ABB2F0D31~|~0~1~2~3~4~5; __ar_v4=OPCFQDUERNFMXPGH2GOT4W%3A20160015%3A32%7CVBGSOVJ2QFHXROI6AFOFKH%3A20160015%3A32%7C2XK4FFQETRGHTNEHWN6VRC%3A20160015%3A32; utag_main=v_id:01501d3042160012252fb34d699e0606d0041065009dc$_sn:80$_ss:1$_st:1450848913352$dc_visit:58$_pn:1%3Bexp-session$ses_id:1450847113352%3Bexp-session$dc_event:1%3Bexp-session$dc_region:eu-west-1%3Bexp-session; 50200000_clogin=l=1450847113&v=1&e=1450848946288; optimizelySegments=%7B%222753990332%22%3A%22gc%22%2C%222757810742%22%3A%22referral%22%2C%222762380326%22%3A%22false%22%2C%223081321317%22%3A%22none%22%2C%223519982772%22%3A%22false%22%2C%223528000433%22%3A%22none%22%2C%223530600430%22%3A%22referral%22%2C%223542550397%22%3A%22gc%22%7D; optimizelyBuckets=%7B%223092681454%22%3A%223100240431%22%7D; optimizelyPendingLogEvents=%5B%5D';

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({message: 'Welcome to Bluemix Admin API !'});
});
router.get('/cfapps', function (req, res, next) {
    console.log('Invoking REST API ');
    const endpoint = "https://api.ng.bluemix.net";
    const username = "tiwari.vikas@in.ibm.com";
    const password = "Marc@2015";
    var authorization_endpoint = null;
    var token_type = null;
    var access_token = null;
    var refresh_token = null;
    var CloudFoundry = require("cf-nodejs-client").CloudFoundry;
    var CloudFoundryUsersUAA = require("cf-nodejs-client").UsersUAA;
    var CloudFoundryApps = require("cf-nodejs-client").Apps;

    CloudFoundry = new CloudFoundry();
    CloudFoundryUsersUAA = new CloudFoundryUsersUAA();
    CloudFoundryApps = new CloudFoundryApps();

    CloudFoundry.setEndPoint(endpoint);

    CloudFoundry.getInfo().then(function (result) {
        console.log(result);
        authorization_endpoint = result.authorization_endpoint;
        token_endpoint = result.token_endpoint;
        CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
        return CloudFoundryUsersUAA.login(username, password);
    }).then(function (result) {
        refresh_token = result.refresh_token;
        return CloudFoundryUsersUAA.refreshToken(refresh_token);
    }).then(function (result) {
        token_type = result.token_type;
        access_token = result.access_token;
        CloudFoundryApps.setEndPoint(endpoint);
        return CloudFoundryApps.getApps(token_type, access_token);
    }).then(function (result) {
        res.json(result);
    }).catch(function (reason) {
        console.error("Error: " + reason);
    });
/*    rest.get('https://console.ng.bluemix.net/rest/v2/apps', {
        headers: {
            csrfToken: csrfTokenValue,
            cookie: cookieValue
        }
    }).on('complete', function (result) {
        if (result instanceof Error) {
            console.log('Error:' + result.message);
            res.json(result.message);
            this.retry(5000);
        } else {
            res.json(result);
        }
    })*/
});

router.get('/accounts', function (req, res, next) {
    console.log('Invoking REST API ');
    rest.get('https://console.ng.bluemix.net/rest/accounts', {
        headers: {
            csrfToken: csrfTokenValue,
            cookie: cookieValue
        }
    }).on('complete', function (result) {
        if (result instanceof Error) {
            console.log('Error:' + result.message);
            res.json(result.message);
            this.retry(5000);
        } else {
            res.json(result);
        }
    })
});

module.exports = router;
