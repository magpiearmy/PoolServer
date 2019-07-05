const express = require('express');
const bodyParser = require('body-parser');

const routing = require('./routing.js');
const database = require('./database.js');

const app = express();
app.use(bodyParser.json());

database.connectToDatabase(function onConnect() {
  const server = app.listen(8082, function () {
    const { address, port } = server.address();
    console.log('Server listening at http://%s:%s', address, port);
  
    routing.setUpRoutes(app);
  });
});