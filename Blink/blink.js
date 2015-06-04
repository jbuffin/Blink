'use strict';
var sockets = require('./sockets');
var Blink = function BlinkConstructor(Server) {

};
Blink.prototype.listen = function listen(Server) {
  sockets(Server);
};

module.exports = new Blink();
