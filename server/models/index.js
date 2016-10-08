var Promise = require('bluebird');
var db = require('../db');
var database = db.connect();
var splitArray = require('split-array');

module.exports = {
  messages: {
    get: function (cb) {
      // get all messages
      database.query('SELECT * FROM messages', function(err, messages) {
        // console.log(results);
        var fetchUsername = function(msg) {
          return new Promise( (resolve, reject) => {
            database.query(`SELECT users.username FROM users WHERE users.id = ${msg.id_Users}`, (err, results) => {
              // console.log(results[0].username);
              resolve(results[0].username);
            });
          });
        };

        var fetchRoomname = function(msg) {
          return new Promise( (resolve, reject) => {
            database.query(`SELECT rooms.roomname FROM rooms WHERE rooms.id = ${msg.id_Rooms}`, (err, results) => {
              // console.log(results[0].roomname);
              resolve(results[0].roomname);
            });
          });
        };


        messageBoxes = [];

        messages.forEach( message => {  
          messageBoxes.push(message.text);
          messageBoxes.push(fetchUsername(message));
          messageBoxes.push(fetchRoomname(message));
        });

        Promise.all(messageBoxes).then( (messageBoxes) => {
          var organizedMsgs = splitArray(messageBoxes, 3);
          cb(organizedMsgs.map( msgArr => { 
            return {text: msgArr[0], username: msgArr[1], roomname: msgArr[2]};
          }));
        });
      });
    }, // a function which produces all the messages
    post: function (data) {
      var roomID = new Promise( (resolve, reject) => {
        // check if room exists
        database.query(`SELECT rooms.roomname FROM rooms WHERE rooms.roomname = "${data.roomname}"`, function(err, results) {
          if (results.length === 0) {
            // setRoomName #2
            database.query(`INSERT INTO rooms (roomname) VALUES ("${data.roomname}")`, function(err, results) {
              // resolve roomID
              console.log('New Room Added');
              database.query(`SELECT rooms.id FROM rooms WHERE rooms.roomname = "${data.roomname}"`, function(err, results) {
                resolve(results[0].id);
              });
            });

          } else {
            database.query(`SELECT rooms.id FROM rooms WHERE rooms.roomname = "${data.roomname}"`, function(err, results) {
              console.log(results[0].id, 'roomID');
              resolve(results[0].id);
            });
          }
        });
      });

      var userID = new Promise( (resolve, reject) => {
        // check if username exists
        database.query(`SELECT users.username FROM users WHERE users.username = "${data.username}"`, function(err, results) {
          if (results.length === 0) {
            // set username
            database.query(`INSERT INTO users (username) VALUES ("${data.username}")`, function(err, results) {
              console.log('New Username Added');
              // resolve userID
              database.query(`SELECT users.id FROM users WHERE users.username = "${data.username}"`, function(err, results) {
                console.log(results[0].id, 'userID');
                resolve(results[0].id);
              });
            });

          } else {
            database.query(`SELECT users.id FROM users WHERE users.username = "${data.username}"`, function(err, results) {
              console.log(results[0].id, 'userID');
              resolve(results[0].id);
            });
          }
        });
      });
      
      var messageElems = [data.text.trim(), userID, roomID];

      Promise.all(messageElems).then( (attr) => {
        console.log(attr[0], 'message');
        console.log(attr[1], 'user');
        console.log(attr[2], 'room');
        database.query(`INSERT INTO messages (text, id_Users, id_Rooms) VALUES ("${attr[0]}", ${attr[1]}, ${attr[2]})`, function(err, results) {
          if (err) { throw err; }
          // database.query('SELECT * FROM messages', function(err, results) { 
          //   console.log(results.length, 'length');
          //   console.log(results[0].text, 'text'); 
          // });
        });
        console.log('finishing promise', attr);
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (data) {
      // return all messages assoiated with user
    },
    post: function (data) {  
    }
  }
};

