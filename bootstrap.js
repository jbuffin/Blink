'use strict';
var bodyParser = require('body-parser');
var config = require('./config');
var Utils = require('./utils');
var Blink = require('./Blink');

function routes(app) {
  var Server = require('http').Server(app);
  app.use(bodyParser.json());

  var io = require('./sockets')(Server);
  var emitter;
  if (config.redis) {
    emitter = require('socket.io-emitter')(config.redis);
  }

  if(config.env == 'dev') {
    app.get('/', function(req, res) {
      res.sendFile('testpage.html', {
        root: __dirname,
      });
    });
  } else {
    app.get('/', function(req, res) {
      res.send('<p>Hi there 😜</p>');
    });
  }

  app.post('/events', function(req, res) {
    if(Utils.checkAuth(req.body.api_key)) {
      if(emitter) {
        emitter.to(req.body.room).emit('message', req.body);
        res.json({ok:true});
      } else {
        res.json({ok:false, message: 'Was not able to find redis'});
      }
    } else {
      res.json({ok:false, message: 'Invalid API Key'});
    }
  });

  Server.listen(config.port, function() {
    console.log('listening on *:'+config.port);
  });

  return Server;
}
module.exports = routes;
