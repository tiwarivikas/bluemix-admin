var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Bluemix Admin'});
});

router.get('/index.html', function(req, res, next) {
  res.render('index', {title: 'Bluemix Admin'});
});

router.get('/docs-scheduler.html', function (req, res, next) {
  res.render('docs-scheduler', {title: 'Bluemix Admin'});
});

module.exports = router;

