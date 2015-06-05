'use strict';
var Request = require('request');
var Utils = require('../utils');

var EMIT_EVENT = 'message';

var requestTypes = {
  POST: Symbol(),
  PUT: Symbol()
};

var messageHandlers = {
  comment: function() {
    var room = this.rooms[0],
        comment = this.message.payload.comment,
        remoteEndpoint = '/streams/'+room+'/comments';

    var options = {
      endpoint: Utils.buildWinkUrl(remoteEndpoint),
      json: {comment:comment},
      responseEvent: 'new_comment',
      requestType: requestTypes.POST,
    };
    request.call(this, options);
  },
  'join_room': function() {
    var room = this.rooms[0],
        responseEvent = 'joined_room',
        remoteEndpoint = '/streams/'+room+'/viewing';

    var options = {
      endpoint: Utils.buildWinkUrl(remoteEndpoint),
      json: {status:true},
      responseEvent: responseEvent,
      requestType: requestTypes.PUT,
      presence: true
    };
    request.call(this, options);
  },
  'leave_room': function() {
    var room = this.rooms[0],
        responseEvent = 'left_room',
        remoteEndpoint = '/streams/'+room+'/viewing';

    var options = {
      endpoint: Utils.buildWinkUrl(remoteEndpoint),
      json: {status:false},
      responseEvent: responseEvent,
      requestType: requestTypes.PUT,
      presence: true
    };
    request.call(this, options);
  }
};

function MessageHandler(opts) {
  this.message = opts.message;
  this.handle = (messageHandlers[opts.message.payload.type] || defaultHandler);
  this.socket = opts.socket;
  this.rooms = opts.message.rooms;
  this.access_token = opts.message.access_token;
}
module.exports = MessageHandler;

function defaultHandler() {
  // broadcast the event to every room
  this.rooms.forEach(function(room) {
    var clientMessage = Utils.newMessage(room, this.message.event, message.payload);
    this.socket.socket.broadcast.to(room).emit('message', clientMessage);
  }.bind(this));
}

function request(options) {
  var requestOptions = {
    uri: options.endpoint,
    qs: {access_token:this.access_token},
    json: options.json
  };
  var boundCallback = requestCallback.bind(this);
  switch (options.requestType) {
    case requestTypes.POST:
      Request.post(requestOptions, boundCallback);
      break;
    case requestTypes.PUT:
      Request.put(requestOptions, boundCallback);
      break;
    default:
      // no-op
  }

  function requestCallback(error, response, body) {
    if(body.ok) {
      console.log(body.data);
      this.rooms.forEach(function(room) {
        this.socket.socket.broadcast.to(room).emit(EMIT_EVENT, Utils.newMessage(room, options.responseEvent, body.data));
        if(options.presence) {
          this.socket.socket.to('presence-'+room).emit(EMIT_EVENT, Utils.newMessage('presence-'+room, options.responseEvent, body.data));
        }
      }.bind(this));
    }
  }
};
