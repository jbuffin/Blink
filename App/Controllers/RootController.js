var path = require('path');
var config = require('../../config');

var RootController = function() {
  // no-op
};
RootController.prototype.getHomePage = function(req, res) {
  if(config.isDev()) {
    res.sendFile(path.resolve('testpage.html'));
  } else {
    res.send('<p>Hi there 😜</p>');
  }
}

module.exports = new RootController();
