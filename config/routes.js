var Controllers = require('../App/Controllers');
var Utils = require('../utils');
var routes = {
  init: function(app, emitter) {
    app.get('/', Controllers.RootController.getHomePage);

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
  }
}
module.exports = routes;
