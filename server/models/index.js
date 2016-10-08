var db = require('../db');
var database = db.connect();

module.exports = {
  messages: {
    get: function (cb) {
      // get all messages
      // .query('SELECT * FROM messages', function(data) {
      //   console.log(cb(data));
      //   return data;
      // });
    }, // a function which produces all the messages
    post: function (data) {
      // post a message to the database

      var dataObj = JSON.parse(data);


    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (data) {
      // return all messages assoiated with user
    },
    post: function (data) {
      // assign username on sign in 
      database.query(`INSERT INTO users (username) VALUES ('${data.username}')`, function(err, results) {
        if (err) { throw err; }
        console.log(results);
      });
    }
  }
};

