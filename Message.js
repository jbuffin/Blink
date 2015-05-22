'use strict';
var Request = require('request');
var Utils = require('./utils');

var messageHandlers = {
  comment: function(opts) {
    var options = {
      uri: Utils.buildWinkUrl('/streams/'+this.message.data.room+'/comments'),
      qs: {access_token:this.message.access_token},
      json: {comment:this.message.data.comment}
    };

    Request.post(options, function(error, response, body) {
      this.socket.broadcast.to(this.message.data.room).emit('message', {type:'comment', data:body.data});
    }.bind(this));
  }
};

function Message(opts) {
  return {
    message: opts.message,
    handleMessage: messageHandlers[opts.message.type],
    socket: opts.socket
  };
}
module.exports = Message;
