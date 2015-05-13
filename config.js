var ENV = 'dev'; // 'dev' | 'stage' | 'prod'

var port = 3000;
var redis = null;

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
});
var config = {
  port: port,
  env: ENV,
  redis: redis
};

module.exports = config;