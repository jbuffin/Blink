'use strict';
var bodyParser = require('body-parser');
var config = require('./config');
var routes = require('./config/routes');
var Blink = require('./Blink');

function bootstrap(app) {
  app.use(bodyParser.json());

  var Server = require('http').Server(app);
  var io = require('./sockets')(Server);
  var emitter;
  if (config.redis) {
    emitter = require('socket.io-emitter')(config.redis);
  }

  routes.init(app, emitter);

  Server.listen(config.port, function() {
    console.log('listening on *:'+config.port);
  });

  return Server;
}
module.exports = bootstrap;
