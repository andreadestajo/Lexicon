const request = require("request");

var URL = "https://www.ipapi.co/json";

request({
	url: URL,
	json: true
}, (err, response, body) => {
	if(!err && response.statusCode == 200) {
		console.log(body)
	}
});