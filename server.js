var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var calculator = require("./calculator");
    
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get("/expressEntry", function(req, res) {
    var calculatorExport = require('./calculator');

    var calculator = new calculatorExport.calculator();


      // Determine if calculate as married or single
			calculator.married = true;
			calculator.spouseCanadianCitizen = false;
			calculator.spouseCommingAlong = true;

			// Core/Humam Capital Factors
			calculator.age = 33;
			calculator.educationLevel = calculatorExport.educationLevel.BachelorsDegree;
			calculator.firstLanguage.test = calculatorExport.languageTest.ielts;
			calculator.firstLanguage.speaking = 7;
			calculator.firstLanguage.listening = 8;
			calculator.firstLanguage.reading = 7;
			calculator.firstLanguage.writting = 7;
			calculator.workInCanada = 0;
			calculator.workExperience = 13;

			//Spouse Factors
			calculator.spouseEducationLevel = calculatorExport.educationLevel.BachelorsDegree;
			calculator.spouseLanguage.test = calculatorExport.languageTest.ielts;
			calculator.spouseLanguage.speaking = 7;
			calculator.spouseLanguage.listening = 8;
			calculator.spouseLanguage.reading = 7;
			calculator.spouseLanguage.writting = 7;
			calculator.spouseWorkInCanada = 0;

			//Skill Transferability Factors
			calculator.certificateFromProvince = false;
			calculator.nocJobOffer = null;
			calculator.nomination = false;

			var scores = calculator.calculate();

    //res.status(200).json(calculator.test());
    
    res.status(200).json(scores);

    //res.status(200).json(req.query);
});