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
    const id = req.id;

    //TODO: if device | region | id is not defined return 4xx response

    /* Date Query Parsing */
    // if query is undefined return {} object...
    // if(isNaN(req.params.id)) res.json({}); // id is not number..
    // TODO: Undefined check...
    var result = {};
    var dates = req.query.date.split(",");

    let promises = [];

    
    for(let date of dates){
        promises.push(appDao.findCrawlDataById(device, region, date, id));
    }

    Promise.all(promises).then(values => {
        res.status(200).json({msg : 'Get Crawl Datas success', err : '', value : values});
    }, reason => {
        res.status(500).send('Internal Server Error : Promise is not all resolved');
    });
}