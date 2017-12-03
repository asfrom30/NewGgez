const mongoDbHelperFactory = require('../../common/utils/db/mongo.db.helper.factory');
const config = require('../../config/config');

exports.find = function(req, res, next) {

    // FIXME: dbname ..
    let mongoDbHelper = mongoDbHelperFactory.getInstance(config.dbBaseUri, 'pc_kr_web');

    let currentDate = '17-11-09';

    console.log('tierdatas-' + currentDate);
    mongoDbHelper.find('tierdatas-' + currentDate, {})
    .then(result => {
        res.send(result);
    })
}