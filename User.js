'use strict';

function User(object) {
  this.id = object.id || null;
  this.avatar = object.avatar || '';
  this.username  = object.username || '';
  this.name = object.name || '';
  this.score = object.score || 0;
  this.bio = object.bio || '';
}
module.exports = User;
