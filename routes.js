'use strict';
function routes(app) {
  var config = require('./config');
  var io = require('socket.io-emitter')(config.redis);
  var Utils = require('./utils');

  var Comment = require('./Comment');

  if(config.env == 'dev') {
    app.get('/', function(req, res) {
      res.sendFile('index.html', {
        root: __dirname,
      });
    });
  }

  app.post('/events', function(req, res) {
    if(Utils.checkAuth(req.body.api_key)) {
      io.to(req.body.room).emit('message', new Comment(req.body.data));
      res.json({OK:true});
    } else {
      res.json({OK:false});
    }
  });
}
module.exports = routes;
