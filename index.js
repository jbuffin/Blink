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
  socket.on('comment', function(msg) {
    console.log(msg);
    socket.broadcast.emit('comment', msg);
  });
});

http.listen(config.defaultPort, function() {
  console.log('listening on *:'+config.defaultPort);
});
