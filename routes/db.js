var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('db operations..');
    db.insert({crazy: true}, 'rabbit', function (err, body) {
        if (!err)
            console.log(body);
    });
});
router.get('/profiles', function (req, res, next) {
    //res.send('db operations..');
    db.list(function (err, body) {
        if (!err) {
            console.log(body);
            res.json(body);
        }
    });
});

router.get('/profiles/:id', function (req, res, next) {
    //res.send('db operations..');
    db.get(req.params.id, function (err, body) {
        if (!err) {
            console.log(body);
            res.json(body);
        } else {
            console.log(err);
            res.send("Error occured..");
        }
    });
});
router.post('/profile', function (req, res, next) {
    //res.send('db operations..');
    db.insert(req.body, function (err, body) {
        if (!err) {
            console.log(body);
            res.json(body);
        } else {
            console.log(err);
            res.send("Error occured..");
        }
    });
});

module.exports = router;