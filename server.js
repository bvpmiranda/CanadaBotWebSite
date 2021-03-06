var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({ "error": message });
}

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});

app.get("/test", function (req, res) {
	res.status(200).json(req.query);
});

app.get("/expressEntry", function (req, res) {
	var flow = require('./expressEntry/expressEntryFlow');
	var calculator = require('./expressEntry/expressEntry');

	var nextFlow = flow.nextFlow(req.query);

	if (nextFlow.customPayload.question === 'CALC')
	{
		nextFlow.customPayload.score = calculator.calculate(nextFlow.customPayload);

		nextFlow.response = "Yor total score is " + nextFlow.customPayload.score.total;
	}

	res.status(200).json(nextFlow);
});