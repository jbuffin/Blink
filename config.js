'use strict';
var Constants = require('./Constants');

var ENV = Constants.ENV.DEV;
var port = 3000;
var redis = null;
var apiKey = '4BwbMJKnNRmYx2VmaL8WamcJRBvlkuTx1gtfx5M5XJQncuvCNfzWHHRJcitjbGf';
var winkBaseUrl = '';
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
    winkBaseUrl = 'http://dev-api.winkapp.us/v1';
    break;
  case Constants.ENV.STAGE:
    winkBaseUrl = 'http://stage-api.winkapp.us/v1';
    break;
  case Constants.ENV.PROD:
    winkBaseUrl = 'https://api.winkapp.us/v1';
}

var config = {
  port: port,
  env: ENV,
  redis: redis,
  apiKey: apiKey,
  winkBaseUrl: winkBaseUrl
};

module.exports = config;
