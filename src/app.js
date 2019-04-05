var http = require('http');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var routing = require('./routing.js');

var app = express();
app.use(bodyParser.json());

var server = app.listen(8081, '127.0.0.1', function() {
    var host = server.address().address
    var port = server.address().port
    console.log('app listening at http://%s:%s', host, port);

    connectToDatabase(function(db) {
      routing.setUpRoutes(db, app);
    });
});

function connectToDatabase(onConnect) {
	
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'rootpwd1',
		database: 'pool'
	});

	conn.connect(function(err) {
		if (err) throw err;
		console.log('Connected to database.');
		onConnect(conn);
	});
}