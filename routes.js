'use strict';
function routes(app) {
  var config = require('./config');
  var io = require('socket.io-emitter')(config.redis);

  var Comment = require('./Comment');

  app.get('/', function(req, res) {
    res.sendFile('index.html', {
      root: __dirname,
    });
  });

  app.post('/events', function(req, res) {
    io.to(req.body.room).emit('comment', new Comment(req.body.data));
    res.json({response:'OK'});
  });
}
module.exports = routes;
