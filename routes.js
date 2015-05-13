'use strict';
function routes(app, io) {
  var Comment = require('./Comment');

  app.get('/', function(req, res) {
    res.sendFile('index.html', {
      root: __dirname,
    });
  });

  app.post('/events', function(req, res) {
    io.to(req.body.room).emit('comment', new Comment(req.body.data));
    res.json({response:'thanks'});
  });
}
module.exports = routes;
