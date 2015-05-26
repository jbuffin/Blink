'use strict';

var config = require('./config');

var Utils = require('./utils');
var Comment = require('./Comment');

function SetupSockets(Server) {

  var io = require('socket.io')(Server);

  if(config.redis) {
    io.adapter(require('socket.io-redis')(config.redis));
  }

  io.on('connection', function(socket) {
    console.log('a user connected');
    var authorized;

    // must authorize within 30 seconds
    var authTimeout = setTimeout(function() {
      socket.disconnect();
    }, 30000);

    socket.on('authorize', function(data) {
      console.log('authorize');
      authorized = Utils.checkAuth(data.api_key);
      if(authorized) {
        console.log('authorized');
        clearTimeout(authTimeout);
        socket.emit('authorized', 'OK');
      }
    });

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

    socket.on('blink:join_room', function(data) {
      console.log('joined '+data.room);
      socket.join(data.room);
    });

    socket.on('blink:leave_room', function(data) {
      console.log('left '+data.room);
      socket.leave(data.room);
    });

    socket.on('client_event', function(message) {
      console.log(message);

      if (! message.rooms) {
        return false;
      }

      if (message.event == 'new_comment') {
        if(authorized) {
          console.log('authorized');
          Comment({
            message: message,
            socket: socket
          }).handle();
        }

        return;
      }

      // broadcast the event to every room
      for (var index in message.rooms) {
        if (message.rooms.hasOwnProperty(index)) {
          var room = message.rooms[index];
          var clientMessage = Utils.newMessage(room, message.event, message.payload);
          socket.broadcast.to(room).emit('message', clientMessage);
        }
      }
    });

  });

  return io;
}
module.exports = SetupSockets;
