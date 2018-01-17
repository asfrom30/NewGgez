'use strict';
/*eslint no-process-env:0*/

const path = require('path');
const _ = require('lodash');

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),


  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'web-development-env-setting-complex-ref-css-mocha-chai-secret'
  },

  // MongoDB connection options
  mongo: {
    collectionName : {
      tierDatas : 'tier-datas',
      crawlDatas : 'crawl-datas',
    },
    collectionSuffix : {
      current : 'current'
    },
    options: {
      db: {
        safe: true
      }
    }
  },

  crawl : {
    baseUrl : "https://playoverwatch.com/",
  },

  logger : {
    prefix : 'log',
    basePath : path.join(appRoot, '/.log')
  },

  report : {
    prefix : 'report',
    fileType : 'txt',
    basePath : path.join(appRoot, '/.report'),
    tierJson : {
      basePath : path.join(appRoot, '/.report'),
      fileType : 'json',
      prefix : 'tier_data',
    }
  }
  
};

module.exports = _.merge(
    all,
    require('./shared'),
    require(`./${process.env.NODE_ENV}.js`) || {}
);
