var prompt = require('prompt'),
	saveAsCsvService = require('./service/saveAsCsvService.js'),
	json2csvParser = require('json2csv');


prompt.start();

console.log("Choose option:\n 1.friends \n 2.followers")
prompt.get(["option", "screen_name"], function(err, result) {
	if (result["option"] == 1) {
		saveAsCsvService.getFriendsInfo(result["screen_name"]);
	}
	else if(result["option"] == 2){
		saveAsCsvService.getFollowersInfo(result["screen_name"]);
	}
	else {
		console.log("Invalid Input. Please make a choice as 1 or 2");
	}
});

