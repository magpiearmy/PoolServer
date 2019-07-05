const data = require('./data-access.js');

exports.getAllMatches = function (req, res) {
  data.getAllMatches(function (results, err) {
    res.send(results);
  });
}

exports.getPlayerByName = function (req, res) {
  const name = req.params.name;
  data.getPlayerByName(name, function (results, err) {
    res.send(results);
  });
}

exports.getAllMatches = function (req, res) {
  data.getAllMatches(function (results, err) {
    res.send(results);
  });
}

exports.getAllPlayers = function (req, res) {
  data.getAllPlayers(function (results, err) {
    if (err) return console.error('Failed to get all players', err);

    res.send(results);
  });
}

exports.createMatch = function (req, res) {
  const teamId = req.body.home_team_id;
  const homeScore = req.body.home_score;
  const awayScore = req.body.away_score;
  const games = req.body.games;

  data.createNewMatch(teamId, homeScore, awayScore, games, function (err, results) {
    if (err) return console.error('Failed to create match', err);

    res.status(201).send();
  });
}