const mysql = require('mysql');

const MAX_CONNECT_ATTEMPTS = 5;

const DB_HOST = process.env.DB_HOST || 'mysql'
const DB_USER = process.env.DB_USER || 'user1'
const DB_PWD = process.env.DB_PWD || 'userpwd1'
const connectionOptions = {
  host: DB_HOST,
  database: 'pool',
  user: DB_USER,
  password: DB_PWD
}

let db;

exports.connectToDatabase = function (onConnect) {
  connectToDatabase(MAX_CONNECT_ATTEMPTS, onConnect);
}

exports.getConnection = function () {
  return db;
}

const connectToDatabase = function (retries, onConnect) {
  const connection = mysql.createConnection(connectionOptions);

  console.log('Attempting to connect to database (%s tries remaining)', retries)

  connection.connect(function (err) {
    if (err) {
      if (retries > 0) {
        setTimeout(function () {
          connectToDatabase(retries - 1, onConnect)
        }, 2000);
      } else {
        console.error("Could not connect to database", err);
        process.exitCode = 1;
      }
    } else {
      console.log('Connected to database.');
      db = connection;
      onConnect();
    }
  });
}