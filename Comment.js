'use strict';
var Request = require('request');
var Utils = require('./utils');

var commentHandlers = {
  comment: function() {
    var room = this.message.rooms[0],
        access_token = this.message.access_token,
        comment = this.message.payload.message;

    var options = {
      uri: Utils.buildWinkUrl('/streams/'+room+'/comments'),
      qs: {access_token:access_token},
      json: {comment:comment}
    };

    Request.post(options, function(error, response, body) {
      var message = Utils.newMessage(room, 'new_comment', {
        type: 'comment',
        data: body.data
      });

      this.socket.broadcast.to(room).emit('message', message);
    }.bind(this));
  }
};

function Message(opts) {
  return {
    message: opts.message,
    handle: commentHandlers[opts.message.payload.type],
    socket: opts.socket
  };
}
module.exports = Message;
