'use strict';
var config = require('./config');
var Utils = require('./utils');

function routes(app) {
  var io = require('socket.io-emitter')(config.redis);

  if(config.env == 'dev') {
    app.get('/', function(req, res) {
      res.sendFile('index.html', {
        root: __dirname,
      });
    });
  }

  app.post('/events', function(req, res) {
    if(Utils.checkAuth(req.body.api_key)) {
      io.to(req.body.room).emit('message', req.body.data);
      res.json({OK:true});
    } else {
      res.json({OK:false});
    }
  });
}
module.exports = routes;
