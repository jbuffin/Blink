var ENV = 'dev'; // 'dev' | 'stage' | 'prod'

var port = 3000;
var redis = {
  host: 'localhost',
  port: 6379
};
var multi = false;

process.argv.forEach(function(val, index, array) {
  if(val.indexOf('port') === 0) {
    port = val.slice(5);
  }
  if(val.indexOf('redis') === 0) {
    var sep = val.indexOf(':');
    redis.host = val.slice(6, sep);
    redis.port = val.slice(sep+1);
  }
  if(val.indexOf('multi') === 0) {
    multi = true;
  }
});
var config = {
  port: port,
  env: ENV,
  multi: multi,
  redis: redis
};

module.exports = config;