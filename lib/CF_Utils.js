var cflib = require("cf-nodejs-client");
var loginTimeout = 3600000;

//Global Access Token variables for Bluemix
global.token_type = null;
global.access_token = null;
global.endpoint = "https://api.ng.bluemix.net";
global.logindatetime = null;


function cfUtils() {

}
//Initialize Login to Bluemix
cfUtils.prototype.init_login = function(callback) {
   // "use strict";
    if (global.access_token == null || logindatetime == null || (new Date() - logindatetime > loginTimeout)) {
        console.log('Initializing Login process.');
        const username = global.BMX_USERNAME;
        const password = global.BMX_PASSWORD;
        var authorization_endpoint = null;
        var refresh_token = null;
        var CloudFoundry = cflib.CloudFoundry;
        var CloudFoundryUsersUAA = cflib.UsersUAA;

        CloudFoundry = new CloudFoundry();
        CloudFoundryUsersUAA = new CloudFoundryUsersUAA();

        CloudFoundry.setEndPoint(global.endpoint);

        CloudFoundry.getInfo().then(
            function (result) {
                // console.log(result);
                authorization_endpoint = result.authorization_endpoint;
                token_endpoint = result.token_endpoint;
                CloudFoundryUsersUAA.setEndPoint(authorization_endpoint);
                return CloudFoundryUsersUAA.login(username, password);
            }).then(function (result) {
                refresh_token = result.refresh_token;
                return CloudFoundryUsersUAA.refreshToken(refresh_token);
            }).then(function (result) {
                global.token_type = result.token_type;
                global.access_token = result.access_token;
                global.logindatetime = new Date();
                callback();
            }).catch(function (reason) {
                console.error("Error: " + reason);
            });
    }else {
        console.log('Login: using existing token.');
        console.log(global.logindatetime);
        console.log(new Date());
        console.log('Time difference: ' + Math.round(((new Date() - global.logindatetime)/60000)) + " minutes");
        callback();
    }
}
module.exports = cfUtils;