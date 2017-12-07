/* replace with absolute path */
// const MongoDbHelper = require(appRoot + 'common/utils/logger');
const appDao = require('../../../services/dao');
// const mongoDbHelperFactory = require('../../common/utils/db/mongo.db.helper.factory');


exports.storedId = function(req, res, next, id){
    id = Number.parseInt(id);
    req.id = id;
    next();
}

exports.query = function(req, res, next) {
    const device = req.device;
    const region = req.region;
    let id = req.id;


    /* Date Query Parsing */
    // if query is undefined return {} object...
    // if(isNaN(req.params.id)) res.json({}); // id is not number..
    // TODO: Undefined check...
    var result = {};
    var dates = req.query.date.split(",");

    let promises = [];

    
    id = '냅둬라날-3934';
    for(let date of dates){
        promises.push(appDao.findCrawlDataById(device, region, date, id));
    }

    Promise.all(promises).then(values => { 
        res.json(values);
        return;
    }, reason => {
        res.status(500).send('Promise is not all resolved');
        return;
    });
}