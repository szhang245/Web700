/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _Shuai Zhang_ Student ID: _136898236_ Date: _May 19, 2024_
*
********************************************************************************/ 

var serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"];
var serverPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout"];
var serverResponses = ["Welcome to WEB700 Assignment 1", "This course name is WEB700. This assignment was \
prepared by Shuai Zhang", "szhang245@myseneca.ca Shuai Zhang", "Hello, User Logged In", "Main Panel", "Logout Complete. Goodbye"];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function httpRequest(httpVerb, path) {
    var index
    for ( [i,obj] of serverPaths.entries()) {
        if ( obj === path ) {
            index = i
        }
    }
    if ( httpVerb === serverVerbs[index] ) {
        response = "200: " + serverResponses[index]
    }
    else {
        response = "404: Unable to process " + httpVerb + " request for " + path
    }
    return response;
}

function automateTests() {
    var testVerbs = ["GET", "POST"];
    var testPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout", "/randomPath1", "/randomPath2"];
    function randomRequest() {
        var randVerb = testVerbs[getRandomInt(testVerbs.length)];
        var randPath = testPaths[getRandomInt(testPaths.length)];
        console.log(httpRequest(randVerb, randPath));
    }
    setInterval(randomRequest, 1000);
}

automateTests()