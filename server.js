var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
//var calculator = require("/scripts/ee20161119");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/expressEntry", function(req, res) {
    //res.status(200).json(calculator.test());
    
    res.status(200).json(req.query);
});