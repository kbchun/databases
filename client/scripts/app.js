// YOUR CODE HERE:
$(document).ready(function () {

  window.app = {
    // server: 'https://le-chunky-chat.herokuapp.com/classes/messages',
    server: 'http://127.0.0.1:3000/classes/messages',
    firstFetch: true,
    allMsgs: {},
    rooms: {},
    selectedRoom: 'lobby',
    users: {},

    init: function () {
      // submit message, send to server
      $('#submit-text').on('click', function (event) {
        var text = $('#text-box').val();
        var username = window.location.search.slice(window.location.search.indexOf('=') + 1);
        app.send({
          'text': text,
          'username': username,
          'roomname': app.selectedRoom
        });
        $('#text-box').val('');
      });
      $('#text-box').bind('enterKey', function(e) {
        var text = $('#text-box').val();
        var username = window.location.search.slice(window.location.search.indexOf('=') + 1);
        app.send({
          'text': text,
          'username': username,
          'roomname': app.selectedRoom
        });
        $('#text-box').val('');
      });
      $('#text-box').keyup(function(e) {
        if (e.keyCode === 13) {
          $(this).trigger('enterKey');
        }
      });

      // change selected room
      $('#roomButton').on('click', function (event) {
        app.clearMessages();
        app.selectedRoom = $('#room-selector option:selected').val();
        app.firstFetch = true;
        app.allMsgs = {};
        app.fetch();
      });

      // add a new room 
      $('#add-room').on('click', function (event) {
        var newRoom = $('#room-input').val();
        app.renderRoom(newRoom);
      });

      //initialize app
      app.fetch();

      // poll for new messages
      setInterval(function () {
        app.fetch();
      }, 2000);
    },

    send: function (message) {
      $.ajax({
      // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
          console.log('chatterbox: Message sent');
          app.fetch();
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },

    fetch: function () {
      $.ajax({
      // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'GET',
        success: function (data) {
          // data = JSON.parse(data);
          // console.log(data.results, "data")
          console.log(data, 'SUCCESS');
          app.fetchCompleted(JSON.parse(data));
          console.log('chatterbox: Message fetched');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to retrieve message', data);
        }
      });
    },

    // filter old messages and call render on new ones
    fetchCompleted: function (messages) {
      messages.forEach(function (msg) {
        // CHANGE THIS LATER BACK TO CREATEDAT STAMP
        console.log(app.allMsgs);
        if (!app.allMsgs.hasOwnProperty(msg.text)) {
          app.allMsgs[msg.text] = msg;
          app.renderMessage(msg);
        }
      });
      // tells render to prepend
      app.firstFetch = false;
    },

    // remove all messages
    clearMessages: function () {
      $('#chats').empty();
    },

    // put message on the screen
    renderMessage: function (message) {
      // set username to anon if no name is given
      console.log('rendering message', message);
      if (!message.username) {
        var username = 'Anonymous';
      } else {
        var username = message.username;
      }

      // message component
      var $messageBox = $('<div class="messageBox ' + filterXSS(username) + '"></div>');
      var $message = '<div class="message">' + filterXSS(message.text) + '</div>';
      // var $timeStamp = '<div class="timeStamp">' + jQuery.timeago(message.createdAt) + '</div>'; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      var $username = '<div class="username" onClick=app.handleUsernameClick.call(this)>' 
        + filterXSS(username) 
        + '</div>';
      
      // automatically set undefined rooms and empty string rooms to lobby
      if (message.roomname === '' || message.roomname === undefined) {
        var roomname = 'lobby';
      } else {
        var roomname = filterXSS(message.roomname);
      }

      // creating message box
      $messageBox.append($username);
      $messageBox.append($message);
      // $messageBox.append($timeStamp);  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      // creating list of unique rooms
      app.renderRoom(roomname);

      // upon refreshing page, fetching messages for selected room
      if (app.firstFetch && app.selectedRoom === roomname) {
        $('#chats').prepend($messageBox);

      // get new messages live
      } else if (app.selectedRoom === roomname) {
        $('#chats').prepend($messageBox);      
      }

      // checks if user is a friend; if so, bold their messages
      if (app.users.hasOwnProperty(message.username)) {
        $('.' + message.username).addClass('befriended');
      }
    },

    // add room to room picker list
    renderRoom: function (roomname) {
      roomname = roomname.toLowerCase();
      if (!app.rooms.hasOwnProperty(roomname)) {
        var option = $('<option value=' + roomname + '>' + roomname + '</option>');
        $('#room-selector').append(option);
        app.rooms[roomname] = roomname;
        $('#room-input').val('');
      }
    },

    // add user to friends
    handleUsernameClick: function() {
      var name = this.textContent;
      $('.' + name).addClass('befriended');
      if (!app.users.hasOwnProperty(name)) {
        app.users[name] = name;
      } 
    }
  };
 
  // initialize app
  app.init();
});
