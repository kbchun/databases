var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

exports.connect = function() {
  var connection = mysql.createConnection({
    user: 'root',
    password: '1',
    database: 'chat'
  });
  return connection;
}