'use strict';
var path = require('path');
var config = require('../../config');

var RootController = function RootControllerConstructor() {
  // no-op
};
RootController.prototype.getHomePage = function getHomePage(req, res) {
  if(config.isDev()) {
    res.sendFile(path.resolve('testpage.html'));
  } else {
    res.send('<p>Hi there 😜</p>');
  }
}

module.exports = new RootController();
