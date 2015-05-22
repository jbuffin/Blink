'use strict';
var config = require('./config');
var Utils = require('./utils');

function routes(app) {
  var io;
  if (config.redis) {
    io = require('socket.io-emitter')(config.redis);
  }

  if(config.env == 'dev') {
    app.get('/', function(req, res) {
      res.sendFile('index.html', {
        root: __dirname,
      });
    });
  } else {
    app.get('/', function(req, res) {
      res.send('<p>Hi there ;)</p>');
    })
  }

  app.post('/events', function(req, res) {
    if(Utils.checkAuth(req.body.api_key)) {
      if(io) {
        io.to(req.body.room).emit('message', req.body);
        res.json({OK:true});
      } else {
        res.json({OK:false, message: 'Was not able to find redis'});
      }
    } else {
      res.json({OK:false});
    }
  });
}
module.exports = routes;
