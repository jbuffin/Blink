'use strict';
var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var Server = require('http').Server(app);
var config = require('./config');

var routes = require('./routes')(app);

var io = require('./sockets')(Server);

Server.listen(config.port, function() {
  console.log('listening on *:'+config.port);
});
