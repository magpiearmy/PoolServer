const http = require('http');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const routing = require('./routing.js');

const app = express();
app.use(bodyParser.json());

connectToDatabase(function (db) {
	const server = app.listen(8080, '127.0.0.1', function () {
		const { host, port } = server.address();
		console.log('app listening at http://%s:%s', host, port);
	});
	routing.setUpRoutes(db, app);
});

function connectToDatabase(onConnect) {
	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'rootpwd1',
		database: 'pool'
	});

	connection.connect(function (err) {
		if (err) {
			console.error("Could not connect to database", err);
			process.exitCode = 1;
		} else {
			console.log('Connected to database.');
			onConnect(connection);
		}
	});
}