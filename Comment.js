'use strict';

var User = require('./User');

function Comment(object) {
  this.user = new User(object.user);
  this.type = object.type || 0;
  this.comment = object.comment || '';
}
module.exports = Comment;
