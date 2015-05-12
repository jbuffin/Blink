var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');
var Comment = require('./Comment');

app.get('/', function(req, res){
  res.sendFile('index.html', {
    root: __dirname,
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('comment', function(msg) {
    var message = new Comment(msg);
    console.log(message);
    socket.broadcast.emit('comment', message);
  });
});

http.listen(config.port, function() {
  console.log('listening on *:'+config.port);
});
