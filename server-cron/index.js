'use strict';

if(process.env.NODE_ENV === undefined){
  throw new Error('process.env.NODE_ENV is undefined.');
}

const node_env = process.env.NODE_ENV.trim();

if(node_env == 'test' || node_env == 'development' || node_env == 'production') {
    process.env.NODE_ENV = process.env.NODE_ENV.trim();
} else {
    throw new Error("node_env defined is not properly")
}

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    // Register the Babel require hook
    require('babel-register');
}

// Export the application
exports = module.exports = require('./app');