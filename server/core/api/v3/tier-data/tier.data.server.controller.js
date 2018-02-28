const appDao = require('../../../services/dao');

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

exports.storeDate = function(req, res, next, date) {
    req.date = date;
    req.date = '180227'
    next();
}

exports.query = function(req, res, next) {
    const device = req.device;
    const region = req.region;
    const date = req.date;

    appDao.findTierDataByDate(device, region, date).then(tierData => {
        res.json({msg : `tier date in ${date} get success fully`, err : '', value : tierData});
    }, reject => {
        res.status(500).json({msg:'', err:'internal server error in tierdatas...', value :''});
    })
}