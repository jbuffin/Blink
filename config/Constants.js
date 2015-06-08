'use strict';

var constants = {
  ENV: {
    DEV: 'DEV',
    STAGE: 'STAGE',
    PROD: 'PROD'
  },
  WINKBASE: {
    DEV: 'http://dev-api.winkapp.us/v1',
    STAGE: 'https://stage-api.winkapp.us/v1',
    PROD: 'https://api.winkapp.us/v1'
  }
};
module.exports = constants;
