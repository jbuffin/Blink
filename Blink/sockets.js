'use strict';

var config = require('../config');

var Utils = require('../utils');
var MessageHandler = require('./MessageHandler');

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
        clearTimeout(authTimeout);
        socket.emit('authorized', 'OK');
      }
    });

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

    socket.on('blink:join_room', joinRoom.bind(socket));
    socket.on('blink:leave_room', leaveRoom.bind(socket));

    socket.on('client_event', function(message) {
      console.log(message);

      if (! message.rooms) {
        return false;
      }

      if (message.event == 'new_comment') {
        if(authorized) {
          MessageHandler({
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

function joinRoom(data) {
  console.log('joining', data.room);
  var room = data.room;
  if(room) {
    var silent = (room.indexOf('presence-') == 0);
    this.join(room);
    if(!silent) {
      MessageHandler({
        message: {
          payload: {
            type: 'join_room'
          },
          access_token:data.access_token,
          room: room
        },
        socket: this
      }).handle();
    }
  }
}

function leaveRoom(data) {
  console.log('leaving', data.room);
  var room = data.room;
  var silent = false;
  if(room) {
    var silent = (room.indexOf('presence-') == 0);
    this.leave(room);
    if(!silent) {
      MessageHandler({
        message: {
          payload: {
            type: 'leave_room'
          },
          access_token: data.access_token,
          room: room
        },
        socket: this
      }).handle();
    }
  }
}

module.exports = SetupSockets;
