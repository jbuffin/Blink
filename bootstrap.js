'use strict';
var bodyParser = require('body-parser');
var config = require('./config');
var routes = require('./config/routes');

function bootstrap(app) {
  app.use(bodyParser.json());

  var Server = require('http').Server(app);
  var Blink = require('./Blink').listen(Server);

  routes.init(app);

  Server.listen(config.port, function() {
    console.log('listening on *:'+config.port);
  });

  return {
    Server: Server,
    Blink: Blink
  };
}
module.exports = bootstrap;
