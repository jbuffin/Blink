'use strict';
var Utils = require('../utils');
var MessageHandler = require('./MessageHandler');

var Socket = function SocketConstructor(socket) {
  this.socket = socket;

  console.log('a user connected');
  this.authorized = false;
  authorize.call(this);

  this.on('blink:join_room', this.joinRoom.bind(this));
  this.on('blink:leave_room', this.leaveRoom.bind(this));

  this.on('client_event', function(message) {
    console.log(message);

    if (! message.rooms) {
      return false;
    }

    if (message.event == 'new_comment') {
      if(this.authorized) {
        MessageHandler({
          message: message,
          socket: this.socket
        }).handle();
      }

      return;
    }

    // broadcast the event to every room
    for (var index in message.rooms) {
      if (message.rooms.hasOwnProperty(index)) {
        var room = message.rooms[index];
        var clientMessage = Utils.newMessage(room, message.event, message.payload);
        this.socket.broadcast.to(room).emit('message', clientMessage);
      }
    }
  }.bind(this));
};

Socket.prototype.on = function on(event, callback) {
  this.socket.on(event, callback);
};

Socket.prototype.joinRoom = function joinRoom(data) {
  console.log('joining', data.room);
  var room = data.room;
  if(room) {
    var silent = (room.indexOf('presence-') == 0);
    this.socket.join(room);
    if(!silent) {
      MessageHandler({
        message: {
          payload: {
            type: 'join_room'
          },
          access_token:data.access_token,
          room: room
        },
        socket: this.socket
      }).handle();
    }
  }
};

Socket.prototype.leaveRoom = function leaveRoom(data) {
  console.log('leaving', data.room);
  var room = data.room;
  var silent = false;
  if(room) {
    var silent = (room.indexOf('presence-') == 0);
    this.socket.leave(room);
    if(!silent) {
      MessageHandler({
        message: {
          payload: {
            type: 'leave_room'
          },
          access_token: data.access_token,
          room: room
        },
        socket: this.socket
      }).handle();
    }
  }
};

module.exports = Socket;

function authorize() {
  // must authorize within 30 seconds
  var authTimeout = setTimeout(function() {
    this.socket.disconnect();
  }.bind(this), 30000);

  this.on('authorize', function(data) {
    this.authorized = Utils.checkAuth(data.api_key);
    if(this.authorized) {
      clearTimeout(authTimeout);
      this.socket.emit('authorized', Utils.buildResponseJson(true));
    }
  }.bind(this));
}
