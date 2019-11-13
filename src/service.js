const repo = require('./repository.js');

exports.getPlayerByName = function (req, res) {
  const name = req.params.name;
  repo.getPlayerByName(name, function (results, err) {
    res.send(results);
  });
}

exports.getAllMatches = function (req, res) {
  repo.getAllMatches(function (results, err) {
    res.send(results);
  });
}

exports.getAllPlayers = function (req, res) {
  repo.getAllPlayers(function (results, err) {
    if (err) return console.error('Failed to get all players', err);
    res.send(results);
  });
}

exports.createMatch = function (req, res) {

  const match = {
    homeTeamId: req.body.homeTeamId,
    awayTeamId: req.body.awayTeamId,
    homeScore: req.body.homeScore,
    awayScore: req.body.awayScore,
    games: req.body.games
  }

  repo.createMatch(match, (err, result) => {
    if (err) {
      return res.status(400).send();
    }
    res.status(201).send();
  });
}