'use strict';
var Utils = require('../utils');
var MessageHandler = require('./MessageHandler');

var Socket = function SocketConstructor(socket) {
  this.socket = socket;

  console.log('a user connected');
  this.authorized = false;
  authorize.call(this);

  this.on('blink:join_room', this.joinRoom.bind(this))
      .on('blink:leave_room', this.leaveRoom.bind(this))
      .on('client_event', function(message) {
        console.log(message);

        if (! message.rooms) {
          return false;
        }

        if (message.event == 'new_comment') {
          if(this.authorized) {
            new MessageHandler({
              message: message,
              socket: this
            }).handle();
          }
        } else {
          // broadcast the event to every room
          message.rooms.forEach(function(room) {
            var clientMessage = Utils.newMessage(room, message.event, message.payload);
            this.socket.broadcast.to(room).emit('message', clientMessage);
          }.bind(this));
        }

      }.bind(this));
  };

Socket.prototype.on = function on(event, callback) {
  this.socket.on(event, callback);
  return this;
};

Socket.prototype.joinRoom = function joinRoom(data) {
  console.log('joining', data.room);
  var room = data.room;
  if(room) {
    var silent = (room.indexOf('presence-') == 0);
    this.socket.join(room);
    if(!silent) {
      new MessageHandler({
        message: {
          payload: {
            type: 'join_room'
          },
          access_token:data.access_token,
          rooms: [room]
        },
        socket: this
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
      new MessageHandler({
        message: {
          payload: {
            type: 'leave_room'
          },
          access_token: data.access_token,
          rooms: [room]
        },
        socket: this
      }).handle();
    }
  }
};

module.exports = Socket;

function authorize() {
  // must authorize within 30 seconds
  var authTimeout = setTimeout(function() {
    this.socket.emit(
      'not_authorized',
      Utils.buildResponseJson(
        false,
        'Must authorize within 30 seconds'));

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
