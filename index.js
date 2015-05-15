var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var http = require('http');
var Server = http.Server(app);
var io = require('socket.io')(Server);
var config = require('./config');
var Comment = require('./Comment');
var Request = require('request');
var Utils = require('./utils');

var routes = require('./routes')(app);

if(config.redis) {
  io.adapter(require('socket.io-redis')(config.redis));
}

io.on('connection', function(socket) {
  var room,
      accessToken,
      authorized;
  console.log('a user connected');

  // must authorize within 30 seconds
  var authTimeout = setTimeout(function() {
    socket.disconnect();
  }, 30000);

  socket.on('authorize', function(data) {
    clearTimeout(authTimeout);
    authorized = Utils.checkAuth(data.api_key);
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('join room', function(data) {
    console.log('joined '+data.room);
    if(room) {
      socket.leave(room);
    }
    room = data.room;
    socket.join(data.room);
  });
  socket.on('access token', function(data) {
    accessToken = data.access_token;
  });
  socket.on('leave room', function(data) {
    console.log('left '+data.room);
    socket.leave(data.room);
  });
  socket.on('comment', function(msg) {
    var options = {
      uri: Utils.buildWinkUrl('/streams/'+room+'/comments'),
      qs: {access_token:accessToken},
      json: msg.message
    };
    Request.post(options, function(error, response, body) {
      socket.broadcast.to(room).emit('comment', body.data);
    });
  });
});

Server.listen(config.port, function() {
  console.log('listening on *:'+config.port);
});
