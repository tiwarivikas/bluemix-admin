"use-strict";

var express = require('express');
var router = express.Router();
var request = require('request');
var cflib = require("cf-nodejs-client");
var cfUtils = require("../lib/CF_Utils");
var rest = require('../node_modules/restler');

cfUtils = new cfUtils();

/* GET users listing. */
router.get('/cfapps', function (req, res, next) {
    //initialize login to Bluemix
    cfUtils.init_login(function () {
        var cfApps = new cflib.Apps;
        cfApps.setEndPoint(endpoint);
        cfApps.getApps(global.token_type, global.access_token)
            .then(function (result) {
                res.json(result);
            }).catch(function (reason) {
                console.error("Error: " + reason);
            });
    });

    // res.send('respond with a resource');
});

/* Start the App*/
router.get('/startapp/:app_id', function (req, res, next) {
    //initialize login to Bluemix
    cfUtils.init_login(function () {
        var cfApps = new cflib.Apps;
        cfApps.setEndPoint(endpoint);
        cfApps.start(global.token_type, global.access_token, req.params.app_id)
            .then(function (result) {
                res.json(result);
            }).catch(function (reason) {
                console.error("Error: " + reason);
            });
    });
});

/* Stop the App*/
router.get('/stopapp/:app_id', function (req, res, next) {
    //initialize login to Bluemix
    cfUtils.init_login(function () {
        var cfApps = new cflib.Apps;
        cfApps.setEndPoint(endpoint);
        cfApps.stop(global.token_type, global.access_token, req.params.app_id)
            .then(function (result) {
                res.json(result);
            }).catch(function (reason) {
                console.error("Error: " + reason);
            });
    });
});

router.get('/template', function (req, res, next) {
    cfUtils.init_login(function () {
        console.log('Retrieving templates');

    });
});

router.get('/cfspaces', function (req, res, next) {
    cfUtils.init_login(function () {
        console.log('Retrieving Spaces');
        var cfSpaces = new cflib.Spaces;
        cfSpaces.setEndPoint(endpoint);
        cfSpaces.getSpaces(token_type, access_token)
            .then(
            function (result) {
                res.json(result);
            })
            .catch(function (e) {
                console.log("Error occurred while calling cfSpaces: " + e);
            })

    });
});

router.get('/spaceapps/:space_id', function (req, res, next) {
    cfUtils.init_login(function () {
        console.log('Retrieving Spaces');
        var cfSpaces = new cflib.Spaces;
        cfSpaces.setEndPoint(endpoint);
        cfSpaces.getSpaceApps(token_type, access_token, req.params.space_id)
            .then(
            function (result) {
                res.json(result);
            })
            .catch(function (e) {
                console.log("Error occurred while calling api/spacespps: " + e);
            })

    });
});

//NOT WORKING
router.get('/defaults', function (req, res, next) {
    cfUtils.init_login(function () {
        console.log(global.token_type + ' ' + global.access_token);
        rest.get('https://console.ng.bluemix.net/api/v3/account-status?direct=classic', {
            headers: {
                Authorization: global.token_type + ' ' + global.access_token
            }
        }).on('complete', function (result) {
            console.log(result);
            if (result instanceof Error) {
                console.log('Error:' + result.message);
                res.json(result.message);
                this.retry(5000);
            } else {
                res.json(result);
            }
        });
    });
});


module.exports = router;
