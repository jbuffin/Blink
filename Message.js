'use strict';
var Request = require('request');
var Utils = require('./utils');

var messageHandlers = {
  comment: function() {
    var room = this.message.rooms[0],
        access_token = this.message.access_token,
        comment = this.message.payload.comment;

    var options = {
      uri: Utils.buildWinkUrl('/streams/'+room+'/comments'),
      qs: {access_token:access_token},
      json: {comment:comment}
    };

    Request.post(options, function(error, response, body) {
      console.log(body);
      this.socket.broadcast.to(room).emit(room+'#message', {
        type:'comment',
        data: body.data});
    }.bind(this));
  }
};

function Message(opts) {
  return {
    message: opts.message,
    handle: messageHandlers[opts.message.payload.type],
    socket: opts.socket
  };
}
module.exports = Message;
