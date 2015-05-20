'use strict';

var ENV = 'dev'; // 'dev' | 'stage' | 'prod'

var port = 3000;
var redis = null;
var apiKey = '4BwbMJKnNRmYx2VmaL8WamcJRBvlkuTx1gtfx5M5XJQncuvCNfzWHHRJcitjbGf';
var winkBaseUrl = '';
switch (ENV) {
  case 'dev':
    winkBaseUrl = 'http://dev-api.winkapp.us/v1';
    break;
  case 'stage':
    winkBaseUrl = 'http://stage-api.winkapp.us/v1';
    break;
}

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
    ENV = val.slice(4);
  }
});
var config = {
  port: port,
  env: ENV,
  redis: redis,
  apiKey: apiKey,
  winkBaseUrl: winkBaseUrl
};

module.exports = config;
