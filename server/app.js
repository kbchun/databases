var express = require('express');
var db = require('./db');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

// Router
var router = require('./routes.js');

// controllers
var controllers = require('./controllers/index');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

// Set up our routes
app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../client'));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

// headers

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

// handle get requests

// app.get('/classes/messages', (req, res) => {
//   console.log(req, "messages");
//   controllers.messages.get(req, res);

//   // attach all messages from database to res

//   res.send(200).end();
// });

// app.get('/classes/users', (req, res) => {
//   console.log(req, "users");
//   controllers.users.get(req, res);
//   res.send(200).end();
// });

// app.post('/classes/messages', (req, res) => {
//   controllers.messages.post(req, res);
//   res.send(201);
// });

























