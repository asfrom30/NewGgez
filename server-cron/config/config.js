// proecess.env.NODE_ENV = { development or production or debug }
const common = require('./common/crawl.target.config');
const env = require('./env/' + process.env.NODE_ENV + '.js');

module.exports = {
    /* Crwal Config */
    targetUrl : common.targetUrl,

    /* Database Config */
    dbBaseUrl : 'mongodb://localhost/',
    dbName : env.dbName,

    /* Logger Env */

    /* Report Env */
}