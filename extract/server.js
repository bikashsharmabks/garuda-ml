var prompt = require('prompt'),
	saveAsCsv = require('./service/saveAsCsv.js');


prompt.start();

console.log("Choose option:\n 1.friends \n 2.followers")
prompt.get(["option", "screen_name"], function(err, result) {
	if (result["option"] == 1) {
		saveAsCsv.getFriendsInfo(result["screen_name"]);
	}
	else if(result["option"] == 2){
		saveAsCsv.getFollowersInfo(result["screen_name"]);
	}
	else {
		console.log("Invalid Input. Please make a choice as 1 or 2");
	}
});

