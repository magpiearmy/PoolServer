
let dataModule = require('./data.js');

module.exports = function (db) {
	let data = dataModule(db);
	return {

		getAllMatches: function (req, res) {
			data.getAllMatches(function (results, err) {
				res.send(results);
			});
		},

		getPlayerByName: function (req, res) {
			var name = req.params.name;
			data.getPlayerByName(name, function (results, err) {
				res.send(results);
			});
		},

		getAllMatches: function (req, res) {
			data.getAllMatches(function (results, err) {
				res.send(results);
			});
		},

		getAllPlayers: function (req, res) {
			data.getAllPlayers(function (results, err) {
				if (err) return console.error('Failed to get all players', err);
				
				res.send(results);
			});
		},

		createMatch: function (req, res) {
	
			var teamId = req.body.home_team_id;
			var homeScore = req.body.home_score;
			var awayScore = req.body.away_score;
			var games = req.body.games;
	
			data.createNewMatch(teamId, homeScore, awayScore, games, function (err, results) {
				if (err) return console.error('Failed to create match', err);
				
				res.status(201).send();
			});
		},
	}
}