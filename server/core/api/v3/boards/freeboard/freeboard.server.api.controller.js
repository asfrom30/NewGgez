import { isNumber } from 'util';

const mongoose = require('mongoose');
const Freeboard = mongoose.model('Freeboard');


exports.save = function(req, res, next) {

    if(!req.isAuthenticated()) return res.status(401).json({err : 'unauthorized'});
    if(req.body == null) res.status(404).json({err : 'bad_request'});
    const user = req.user;
    const title = req.body.title;
    const content = req.body.content; //TODO: vaild foramt check ops
    
    if(title == "error") res.status(404).json({err : 'test error'});
    
    new Freeboard({title: title, content : content, owner : user}).save().then(result => {
        res.json(result);
    }, reason => {
        res.status(500).json({err : 'internal server error'});
    })

}


exports.findById = function(req, res, next, id){
    id = parseInt(id);

    if(!isNumber(id)) { 
        res.status(404).send();
    } else {
        Freeboard.findOne({_id : id})
        // .populate('comments')
        .populate({ 
            path: 'comments',
            populate: {
              path: 'owner',
              model: 'User',
              select : ['email', 'username'],
            } 
         })
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
    const freeboard = req.freeboard;
    freeboard.update({$inc: {view_count :1}}, function(err){
        //TODO: LOG ERROR
        //wheter error occurs or not. It must response
        res.json(freeboard);
    });
}

// get page(list)
exports.query = function(req, res, next) {
    const pageNum = parseInt(req.query.page);
    const limit = 10;
    if(!isNumber(pageNum)) { 
        res.status(404).send();
    } else {
        Freeboard
            .find({}, {content : 0, comments : 0})
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