var ENV = 'dev'; // 'dev' | 'stage' | 'prod'

var port = 3000;

process.argv.forEach(function(val, index, array) {
  if(val.indexOf('port') === 0) {
    port = val.slice(5);
  }
});
var config = {
  port: port,
  env: ENV,
};

module.exports = config;