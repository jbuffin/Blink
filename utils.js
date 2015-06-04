'use strict';

var config = require('./config');

module.exports = {
  buildWinkUrl: function buildWinkUrl(path) {
    return config.winkBaseUrl+path;
  },
  checkAuth: function checkAuth(key) {
    return key == config.apiKey;
  },

  newMessage: function newMessage(room, event, payload) {
    return {
      room: room,
      event: event,
      payload: payload,
    }
  },

  reBroadcast: function reBroadcast(socket, event, data) {
    for (var index in socket.rooms) {
      if (socket.rooms.hasOwnProperty(index) && socket.rooms[index] !== socket.id) {
        socket.broadcast.to(socket.rooms[index]).emit(event, data);
      }
    }
  },

  buildResponseJson: function buildResponseJson(ok, message) {
    return {
      ok: ok == true,
      message: message
    };
  }
};
