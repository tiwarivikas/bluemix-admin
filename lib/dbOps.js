var dbName = 'bluemix-admin';

function dbOps() {

}

dbOps.prototype.initDBConnection = function () {
    var dbCredentials = global.config.CloudantCreds;
    cloudant = require('nano')(dbCredentials.url);
    // check if DB exists if not create
    /*cloudant.db.create(dbName, function (err, res) {
     if (err) { console.log('could not create db ', err); }
     });*/
    global.db = cloudant.db.use(dbName);
}

module.exports = dbOps;