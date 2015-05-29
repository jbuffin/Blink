'use strict';
var Request = require('request');
var Utils = require('./utils');

var commentHandlers = {
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
      var message = Utils.newMessage(room, 'new_comment', {
        type: 'comment',
        data: body.data
      });

      this.socket.broadcast.to(room).emit('message', message);
    }.bind(this));
  },
  'join_room': function() {
    var room = this.message.room,
        access_token = this.message.access_token;

    var options = {
      uri: Utils.buildWinkUrl('/streams/'+room+'/viewing'),
      qs: {access_token:access_token},
      json: {status:true}
    };
    Request.put(options, function(error, response, body) {
      if(body.ok) {
        this.socket.broadcast.to(room).emit('message', Utils.newMessage(room, 'joined_room', body.data));
        this.socket.to('presence-'+room).emit('message', Utils.newMessage('presence-'+room, 'joined_room', body.data));
      }
    }.bind(this));
  },
  'leave_room': function() {
    var room = this.message.room,
        access_token = this.message.access_token;

    var options = {
      uri: Utils.buildWinkUrl('/streams/'+room+'/viewing'),
      qs: {access_token:access_token},
      json: {status:false}
    };
    Request.put(options, function(error, response, body) {
      if(body.ok) {
        this.socket.broadcast.to(room).emit('message', Utils.newMessage(room, 'left_room', body.data));
        this.socket.broadcast.to('presence-'+room).emit('message', Utils.newMessage('presence-'+room, 'left_room', body.data));
      }
    }.bind(this));
  }
};

function defaultHandler() {
  // noop
}

function MessageHandler(opts) {
  return {
    message: opts.message,
    handle: commentHandlers[opts.message.payload.type],
    socket: opts.socket
  };
}
module.exports = MessageHandler;
