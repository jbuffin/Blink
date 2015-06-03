'use strict';
var Constants = require('./Constants');

var ENV = Constants.ENV.DEV;
var port = 3000;
var redis = null;
var apiKey = '4BwbMJKnNRmYx2VmaL8WamcJRBvlkuTx1gtfx5M5XJQncuvCNfzWHHRJcitjbGf';
var winkBaseUrl = Constants.WINKBASE.DEV;
process.argv.forEach(function(val, index, array) {
  if(val.indexOf('port') === 0) {
    port = val.slice(5);
  }
  if(val.indexOf('redis') === 0) {
    var sep = val.indexOf(':');
    redis = {};
    redis.host = val.slice(6, sep);
    redis.port = val.slice(sep+1);
  }
  if(val.indexOf('api_key') === 0) {
    apiKey = val.slice(8);
  }
  if(val.indexOf('ENV') === 0) {
    var envInput = val.slice(4);
    if(envInput && Constants.ENV[envInput]) {
      ENV = Constants.ENV[envInput];
    }
  }
});

switch (ENV) {
  case Constants.ENV.DEV:
    winkBaseUrl = Constants.WINKBASE.DEV;
    break;
  case Constants.ENV.STAGE:
    winkBaseUrl = Constants.WINKBASE.STAGE;
    break;
  case Constants.ENV.PROD:
    winkBaseUrl = Constants.WINKBASE.PROD;
    break;
  default:
    // no-op
}

var config = {
  port: port,
  env: ENV,
  redis: redis,
  apiKey: apiKey,
  winkBaseUrl: winkBaseUrl,
  isDev: function() {return this.isEnv(Constants.ENV.DEV);},
  isStage: function() {return this.isEnv(Constants.ENV.DEV);},
  isProd: function() {return this.isEnv(Constants.ENV.PROD);},
  isEnv: function(env) {
    if(Constants.ENV[env]) {
      return this.env == Constants.ENV[env];
    } else {
      return false;
    }
  }
};

module.exports = config;
