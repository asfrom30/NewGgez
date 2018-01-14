'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';
import secrets from '../../../.secrets';


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


  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: secrets.session
  },

  // MongoDB connection options
  mongo: {
    defaultUri : 'mongodb://localhost/',
    collectionName : {
      sessions : 'sessions',
      tierDatas : 'tier-datas',
      crawlDatas : 'crawl-datas',
    },
    collectionSuffix : {
      current : 'current',
    },
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/twitter/callback`
  },

  google: {
    clientID: process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = function(){

  const shared = require('./shared');

  const config = _.merge(
    all,
    shared,
    require(`./${process.env.NODE_ENV}.js`) || {}
  );

  config.mongo.uriList = {};

  /* If you are using mongoose shcema. uncommented below code */
  for(let device of shared.devices) {   
    for(let region of shared.regions) {
      const suffix = `_${device}_${region}`;
      config.mongo.uriList[suffix] = config.mongo.baseUri + suffix;
    }
  }
  
  return config;
}();
