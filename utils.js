var config = require('./config');

module.exports = {
  buildWinkUrl: function buildWinkUrl(path) {
    return config.winkBaseUrl+path;
  },
  checkAuth: function checkAuth(key) {
    return key == config.apiKey;
  }
};
