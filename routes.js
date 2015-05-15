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
    if(req.body.api_key === config.apiKey) {
      io.to(req.body.room).emit('comment', new Comment(req.body.data));
      res.json({OK:true});
    } else {
      res.json({OK:false});
    }
  });
}
module.exports = routes;
