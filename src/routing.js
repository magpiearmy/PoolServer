const service = require('./service.js');

exports.setUpRoutes = function (app) {
  app.get('/players/team/:teamId', service.getPlayersByTeamId);

  app.get('/player/:playerId', service.getPlayerById);
  app.get('/player/name/:name', service.getPlayerByName);

  app.get('/matches/team/:teamId', service.getMatchesByTeamId);

  app.post('/match', service.createMatch);
}