const serviceModule = require('./service.js');

module.exports.setUpRoutes = function (db, app) {
  const service = serviceModule(db);
  app.get('/players', service.getAllPlayers);
  app.get('/player/name/:name', service.getPlayerByName);
  app.get('/matches', service.getAllMatches);
  app.post('/match', service.createMatch);
}