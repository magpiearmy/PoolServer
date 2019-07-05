const service = require('./service.js');

exports.setUpRoutes = function (app) {
  app.get('/players', service.getAllPlayers);
  app.get('/player/name/:name', service.getPlayerByName);
  app.get('/matches', service.getAllMatches);
  app.post('/match', service.createMatch);
}