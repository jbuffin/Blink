'use strict';
var config = require('../config');
var Socket = require('./socket');
var Utils = require('../utils');

var Blink = function BlinkConstructor() {
  this._sockets = [];
};

Blink.prototype.listen = function listen(Server) {
  this.io = require('socket.io')(Server);
  if(config.redis) {
    this.io.adapter(require('socket.io-redis')(config.redis));
  }
  this.io.on('connection', this.newSocket.bind(this));

  return this;
};

Blink.prototype.newSocket = function newSocket(socket) {
  var newSocket = new Socket(socket);
  var index = this._sockets.push(newSocket)-1;
  newSocket.on('disconnect', function() {
    console.log('user disconnected');
    this._sockets.splice(index, 1);
  }.bind(this));
};

Blink.prototype.externalMessage = function externalMessage(data) {
  var message = Utils.newMessage(data.room, data.event, data.payload)
  this.io.to(data.room).emit('message', message);
  return true;
};

module.exports = new Blink();
