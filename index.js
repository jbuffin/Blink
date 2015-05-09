var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg) {
    var msgObject = {
      user: {
        username: "eric",
        name: "Eric Bockmuller",
        score: 20,
        avatar: "http://lorempixel.com:80/128/128/people/"+Math.floor((Math.random() * 10) + 1)
      },
      comment: msg,
      type: 0,
    };
    socket.broadcast.emit('chat message', msgObject);
  });
});

http.listen(config.defaultPort, function() {
  console.log('listening on *:'+config.defaultPort);
});
