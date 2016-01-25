var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({message: 'Welcome to Bluemix Admin API !'});
    pickThemUp(driver, hitchhikers);
    console.log(driver.droppedPeople);
});

var hitchhikers = [{
    location: '0,1',
    destination: '1,2',
    name: 'Pierre',
    id: "229972d4-acea-583b-a9bc-012a228eeb5f"
},
    {
        location: '0,1',
        destination: '1,2',
        name: 'Nicolas',
        id: "229972d4-a4fa-583b-a10gc-012a228eeb2c"
    },
    {
        location: '1,2',
        destination: '2,3',
        name: 'Johanne',
        id: "229972d4-0e1a-583b-a9bc-012a228eeb5g"
    }];

var driver = {
    "firstname": "A",
    "lastname": "B",
    "path": ['0,1', '1,2', '2,4'],
    "car": {
        "roomAvailable": "3"
    },
    "droppedPeople": []
};
function pickThemUp(driver, hitchhikers) {
    roomAvailable = driver.car.roomAvailable;
    var passengers = new Array();
    for (i = 0; i < driver.path.length; i++) {
        location = driver.path[i];
        dropAtLocation(location, passengers, driver);
        pickAtLocation(location, passengers, hitchhikers, driver);
    }

}
function dropAtLocation(location, passengers, driver) {
    for (i = 0; i < passengers.length; i++) {
        if (location == passengers[i].destination) {
            driver.droppedPeople.push(passengers[i].id);
            passengers.splice(i, 1);
            driver.car.roomAvailable += 1;
        }
    }
}

function pickAtLocation(location, passengers, hitchhikers, driver) {
    for (i = 0; i < hitchhikers.length; i++) {
        if (driver.car.roomAvailable > 1) {
            if (location == hitchhikers[i].location) {
                passengers.push(hitchhikers[i]);
                hitchhikers.splice(i, 1);
                driver.car.roomAvailable -= 1;
            }
        }
    }
}

module.exports = router;