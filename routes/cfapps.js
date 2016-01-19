/**
 * Created by vikas on 12/18/2015.
 */
var express = require('express');
var router = express.Router();
var rest = require('../node_modules/restler');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('cfapps', {title: 'Bluemix Admin 0.1'});
});
router.get('/cfapps.html', function (req, res, next) {
    res.render('cfapps', {title: 'Bluemix Admin 0.1'});
});


module.exports = router;
