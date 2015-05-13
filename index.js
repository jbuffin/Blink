var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');
var Comment = require('./Comment');

if(config.multi) {
  var redis = require('socket.io-redis');
  io.adapter(redis(config.redis));
}
app.get('/', function(req, res){
  res.sendFile('index.html', {
    root: __dirname,
  });
});

io.on('connection', function(socket) {
  var room;
  console.log('a user connected');
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
  socket.on('leave room', function(data) {
    console.log('left '+data.room);
    socket.leave(data.room);
  });
  socket.on('comment', function(msg) {
    var message = new Comment(msg);
    console.log(message);
    socket.broadcast.to(room).emit('comment', message);
  });
});

http.listen(config.port, function() {
  console.log('listening on *:'+config.port);
});
