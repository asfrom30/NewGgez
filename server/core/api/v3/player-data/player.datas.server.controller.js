/* replace with absolute path */
// const MongoDbHelper = require(appRoot + 'common/utils/logger');
const mongoDbHelperFactory = require('../../common/utils/db/mongo.db.helper.factory');
const config = require('../../config/config');

exports.find = function(req, res, next) {

    /* Response Status */
    let responseStatusObj = {};

    if(req.player == {}) {
        res.json({error : 'id[' + id + '] is not database'});  //TODO: SEND ERROR TO CLIENT
    }

    let btg = req.player.btg;

    /* Date Query Parsing */
    /* Undefined Check */
    // if query is undefined return {} object...
    // if(isNaN(req.params.id)) res.json({}); // id is not number..

    var result = {};
    var dates = req.query.date.split(",");

    /* Get All player data in dates */
    let mongoDbHelper = mongoDbHelperFactory.getInstance(config.dbBaseUri, config.dbName);
    let promiseArray = [];

    for(date of dates){
        let tempDate = date; // must be declared... because of promise...
        let promise = new Promise((resolve, reject) => {
            mongoDbHelper.find('playerdatas-'+ tempDate, {_id : btg}, function(res){
                let data = {};
                let meta = {};
                if(res.length != 0) {
                    meta = res[0]._meta;
                    data = res[0]._value;   // FIXME: THIS MUST BE REPLACED WITH FINDWITHONE
                }
                resolve({date : tempDate, meta : meta, data : data});
            });
        })
        promiseArray.push(promise);
    }

    Promise.all(promiseArray).then(values => { 
        var result = {};
        result.response_status = responseStatusObj;
        result.datas = [];
        for(value of values) {
            result.datas.push({date : value.date, meta : value.meta, data : value.data});
        }
        res.json(result);
    }, reason => {
        responseStatusObj.err = 'not_promised_all';
        res.json(responseStatusObj); //TODO: SEND ERROR TO CLIENT
    });
}

//@Depreacated
exports.findById = function(req, res, next){
    
    let mongoDbHelper = new MongoDbHelper("mongodb://localhost:27017/", "pc_kr"); // TODO: GET PARAMS FROM CONFIG
    
    // FIND BTG FIRST BASED ON ID...
    let id = parseInt(req.params.id);
    var promise = mongoDbHelper.find('playerlist', {_id : id}) //TODO: REPLACE FIND ONE METHOD... //TODO: My Query is Too slow compare with Mongoose
    var jsonMeta = {};

    promise.then(result => {
        /* exception check */
        if(result.length == 0) {
            res.json({error : 'id[' + id + '] is not database'});  //TODO: SEND ERROR TO CLIENT
            return;
        }

        let btg = result[0].btg;
        jsonMeta.id = id;
        jsonMeta.btg = btg; // TODO: Replace with battle name
        
        let promiseArray = [];

        for(date of dates){
            let tempDate = date; // must be declared... because of promise...
            let promise = new Promise((resolve, reject) => {
                mongoDbHelper.find('playerdatas-'+ tempDate, {_id : btg}, function(res){
                    let data = {};
                    if(res.length != 0) {
                        data = res[0]._value;
                    }
                    resolve({date : tempDate, meta : meta, data : data});
                });
            })
            promiseArray.push(promise);
        }

        Promise.all(promiseArray).then(values => { 
            var result = {};
            result.meta = jsonMeta; // TODO: BUILD META DATA
            result.datas = [];
            for(value of values) {
                result.datas.push({date : value.date, data : value.data});
            }
            

            res.json(result);
        }, reason => {
            res.json(reason); //TODO: SEND ERROR TO CLIENT
        });
    }, reason => {
        res.json({}); //TODO: SEND ERROR TO CLIENT
    })
}
