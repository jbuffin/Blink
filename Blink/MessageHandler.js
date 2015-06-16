'use strict';
var Request = require('request');
var Utils = require('../utils');

var EMIT_EVENT = 'message';

var requestTypes = {
  POST: Symbol(),
  PUT: Symbol()
};

var messageHandlers = {
  'new_comment': function() {
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
  'blink:join_room': function() {
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
  'blink:leave_room': function() {
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
  },
  'give_wink': function() {
    var room = this.rooms[0],
    responseEvent = 'give_wink',
    remoteEndpoint = '/streams/'+room+'/wink';

    var options = {
      endpoint: Utils.buildWinkUrl(remoteEndpoint),
      json: {},
      responseEvent: responseEvent,
      requestType: requestTypes.POST,
      presence: false,
    };
    request.call(this, options);
  }
};

function MessageHandler(opts) {
  this.message = opts.message;
  this.handle = (messageHandlers[opts.message.event] || defaultHandler);
  this.socket = opts.socket;
  this.rooms = opts.message.rooms || [opts.message.room];
  this.access_token = opts.message.access_token;
}
module.exports = MessageHandler;

function defaultHandler() {
  // broadcast the event to every room
  this.rooms.forEach(function(room) {
    var clientMessage = Utils.newMessage(room, this.message.event, this.message.payload);
    this.socket.socket.broadcast.to(room).emit(EMIT_EVENT, clientMessage);
  }.bind(this));
}

function request(options) {
  var requestOptions = {
    uri: options.endpoint,
    qs: {access_token:this.access_token},
    json: options.json
  };

  // @todo do better error handling request.on('error')
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
    if(body && body.ok) {
      console.log('response body:', body);
      this.rooms.forEach(function(room) {
        this.socket.socket.broadcast.to(room).emit(EMIT_EVENT, Utils.newMessage(room, options.responseEvent, body.data));
        if(options.presence) {
          this.socket.socket.to('presence-'+room).emit(EMIT_EVENT, Utils.newMessage('presence-'+room, options.responseEvent, body.data));
        }
      }.bind(this));
    } else {
      console.error('There was an error: ', options);
      console.error('Request Type:', options.requestType == requestTypes.POST ? 'POST' : (options.requestType == requestTypes.PUT ? 'PUT' : ''));
      console.error(error);
    }
  }
};
