var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('mbapp', {title: 'Mobile Application'});
});
router.post('/', function(req, res, next) {
    console.log(req.body.fname);
    res.send('Form has been submitted successfully!');
});
module.exports = router;
