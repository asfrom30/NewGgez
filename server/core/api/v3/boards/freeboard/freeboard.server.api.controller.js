import { isNumber } from 'util';

const Freeboard = require('./freeboard.server.api.model');

exports.save = function(req, res, next) {



    if(req.body == null) res.status(404).json({});
    const title = req.body.title;
    const content = req.body.content; //TODO: vaild foramt check ops
    
    if(title == "error") res.status(404).json({err : 'test error'});
    
    new Freeboard({title: title, content : content}).save().then(result => {
        res.json(result);
    }, reason => {
        res.status(500).json({err : 'internal server error'});
    })

}


// for page query
exports.findById = function(req, res, next, id){
    id = parseInt(id);

    if(!isNumber(id)) { 
        res.status(404).send();
    } else {
        Freeboard.findOne({_id : id})
        .populate('comments')
        .exec()
        .then(result => {
            req.freeboard = result;
            next();
        }, reason => {
            res.status(500).send();
        });
    }
}

exports.read = function(req, res, next) {
    const result = req.freeboard;
    res.json(result);
}

exports.query = function(req, res, next) {
    const pageNum = parseInt(req.query.page);
    const limit = 10;
    if(!isNumber(pageNum)) { 
        res.status(404).send();
    } else {
        Freeboard
            .find({})
            .sort({_id : -1})
            .skip((pageNum -1)*limit)
            .limit(limit)
            .then(result=> {
                res.json(result);
            }, reason => {
                res.status(500).send();
            });
       
    }
}
// for detail query