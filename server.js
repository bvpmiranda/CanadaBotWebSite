var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/expressEntry", function(req, res) {
    //var calculatorExport = require("./calculator");
    //var calculator = new calculatorExport();

    //res.status(200).json(calculator.test());
    
    //res.status(200).json(calculator.exportedA);

    res.status(200).json(req.query);
});