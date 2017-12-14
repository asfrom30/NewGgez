process.env.NODE_ENV = 'development';
require('babel-register');
const appDao = require('./dao.server.controller');

appDao.findCrawlDataById('pc', 'kr', '171212', 1).then(result => {
    console.log(result);
})