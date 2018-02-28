import { isNumber } from 'util';
import { Promise } from 'q';


const mongoose = require('mongoose');
const FreeboardComment = mongoose.model('FreeboardComment');
// const FreeboardComment = require('./freeboard.comment.server.api.model');

exports.save = function (req, res, next) {

    const freeboard = req.freeboard;

    if (freeboard == null) {
        res.status(404).json({ err: 'freeboard_is_not_existed' });
    } else {
        const id = parseInt(req.freeboard._id);
        const content = req.body.content;
        const comment = new FreeboardComment({ owner: id, content: content });

        Promise.resolve().then(() => {
            return comment.save();
        }).then(() => {
            freeboard.comments.push(comment);
            return freeboard.save();
        }).then(() => {
            res.json({msg : 'save successfully'});
        }).catch(reason => {
            res.status(500).json({err : 'internal server error'});
        })
    }
}
