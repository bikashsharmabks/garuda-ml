var Twitter = require('twitter'),
	fs = require('fs'),
	twitterConfig = require('../config.json'),
	Promise = require('bluebird'),
	Json2csvParser = require('json2csv').Parser;

var client = new Twitter(twitterConfig);

module.exports = {
	getFriendsInfo: getFriendsInfo,
	getFollowersInfo: getFollowersInfo
}

function getFriendsInfo(screen_name) {
	return new Promise(function(resolve, reject) {

		var params = {
			screen_name: screen_name,
			count: 200
		};

		client.get('friends/list', params, function(error, usersList, response) {
			if (error)
				return reject(error);
			else {
				var friendsData = [];
				for (var i = 0; i < usersList.users.length; i++) {
					if (usersList.users[i].lang == 'en') {
						friendsData.push({
							'id': usersList.users[i].id,
							'id_str': usersList.users[i].id_str,
							'name': usersList.users[i].name,
							'screen_name': usersList.users[i].screen_name,
							'location': usersList.users[i].location,
							'description': usersList.users[i].description,
							'url': usersList.users[i].url,
							'entities': usersList.users[i].entities,
							'protected': usersList.users[i].protected,
							'followers_count': usersList.users[i].followers_count,
							'friends_count': usersList.users[i].friends_count,
							'listed_count': usersList.users[i].listed_count,
							'created_at': usersList.users[i].created_at,
							'favourites_count': usersList.users[i].favourites_count,
							'utc_offset': usersList.users[i].utc_offset,
							'time_zone': usersList.users[i].time_zone,
							'geo_enabled': usersList.users[i].geo_enabled,
							'verified': usersList.users[i].verified,
							'statuses_count': usersList.users[i].statuses_count,
							'lang': usersList.users[i].lang,
							'status': usersList.users[i].status,
							'contributors_enabled': usersList.users[i].contributors_enabled,
							'is_translator': usersList.users[i].is_translator,
							'is_translation_enabled': usersList.users[i].is_translation_enabled,
							'profile_background_color': usersList.users[i].profile_background_color,
							'profile_background_image_url': usersList.users[i].profile_background_image_url,
							'profile_background_image_url_https': usersList.users[i].profile_background_image_url_https
						})
					}
				}

				try {
					const fields = Object.keys(friendsData[0])
					const opts = {
						fields
					}
					const parser = new Json2csvParser(opts);
					const csv = parser.parse(friendsData);
					fs.writeFile('./data/' + screen_name + '_friends.csv', csv, function(err) {
						if (err) {
							return console.log(err);
						}
						console.log('FILE SUCCESSFULLY WRITTEN!\n');
					});
				} catch (err) {
					console.error(err);
				}
				return resolve(friendsData);
			}
		});

	});
}

function getFollowersInfo(screen_name) {
	return new Promise(function(resolve, reject) {

		var params = {
			screen_name: screen_name
		};

		client.get('followers/list', params, function(error, usersList, response) {
			if (error)
				return reject(error);
			else {
				var followersData = [];

				for (var i = 0; i < usersList.users.length; i++) {
					if (usersList.users[i].lang == 'en') {
						followersData.push({
							'id': usersList.users[i].id,
							'id_str': usersList.users[i].id_str,
							'name': usersList.users[i].name,
							'screen_name': usersList.users[i].screen_name,
							'location': usersList.users[i].location,
							'description': usersList.users[i].description,
							'url': usersList.users[i].url,
							'entities': usersList.users[i].entities,
							'protected': usersList.users[i].protected,
							'followers_count': usersList.users[i].followers_count,
							'friends_count': usersList.users[i].friends_count,
							'listed_count': usersList.users[i].listed_count,
							'created_at': usersList.users[i].created_at,
							'favourites_count': usersList.users[i].favourites_count,
							'utc_offset': usersList.users[i].utc_offset,
							'time_zone': usersList.users[i].time_zone,
							'geo_enabled': usersList.users[i].geo_enabled,
							'verified': usersList.users[i].verified,
							'statuses_count': usersList.users[i].statuses_count,
							'lang': usersList.users[i].lang,
							'status': usersList.users[i].status,
							'contributors_enabled': usersList.users[i].contributors_enabled,
							'is_translator': usersList.users[i].is_translator,
							'is_translation_enabled': usersList.users[i].is_translation_enabled,
							'profile_background_color': usersList.users[i].profile_background_color,
							'profile_background_image_url': usersList.users[i].profile_background_image_url,
							'profile_background_image_url_https': usersList.users[i].profile_background_image_url_https
						})
					}
				}

				try {
					const fields = Object.keys(followersData[0])
					const opts = {
						fields
					}
					const parser = new Json2csvParser(opts);
					const csv = parser.parse(followersData);
					fs.writeFile('./data/' + screen_name + '_followers.csv', csv, function(err) {
						if (err) {
							return console.log(err);
						}
						console.log('FILE SUCCESSFULLY WRITTEN!\n');
					});
				} catch (err) {
					console.error(err);
				}

				return resolve(usersList);
			}
		});

	});
}


// const items = friendsData
// const replacer = (key, value) => value === null ? '' : value
// const header = Object.keys(items[0])
// let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
// csv.unshift(header.join(','))
// csv = csv.join('\r\n')

// fs.writeFile('./data/' + screen_name + '_friends.csv', csv, function(err) {
// 	if (err) {
// 		return console.log(err);
// 	}
// 	console.log('FILE SUCCESSFULLY WRITTEN!\n');
// });