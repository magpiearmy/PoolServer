const repo = require('./repository.js');

exports.getPlayerById = (req, res) => {
  const playerId = req.params.playerId;
  repo.getPlayerById(playerId, function (results, err) {
    if (err) return console.error('Failed to get player by ID', err);
    res.send(results);
  });
}

exports.getPlayerByName = (req, res) => {
  const name = req.params.name;
  repo.getPlayerByName(name, function (results, err) {
    if (err) return console.error('Failed to get player by name', err);
    res.send(results);
  });
}

exports.getPlayersByTeamId = (req, res) => {
  const teamId = req.params.teamId;
  repo.getPlayersByTeamId(teamId, function (results, err) {
    if (err) return console.error('Failed to get all players', err);
    res.send(results);
  });
}

exports.getMatchesByTeamId = (req, res) => {
  const teamId = req.params.teamId;

  repo.getMatchesByTeamId(teamId, (results, err) => {
    if (err) 
      return console.error('Failed to get matches by team ID', err);

    res.send(results);
  })
}

exports.createMatch = (req, res) => {

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