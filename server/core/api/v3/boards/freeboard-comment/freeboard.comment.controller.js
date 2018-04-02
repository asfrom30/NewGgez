import { isNumber } from 'util';


const mongoose = require('mongoose');
const FreeboardComment = mongoose.model('FreeboardComment');



// register Comment
exports.save = function (req, res, next) {

    // authenticate check

    // freboard check
    const freeboard = req.freeboard;
    if (freeboard == null) return res.status(404).json({ err: 'freeboard_is_not_existed' });



    const user = req.user;
    const content = req.body.content;
    const comment = new FreeboardComment({ owner: user, freeboard: freeboard, content: content });

    Promise.resolve().then(() => {
        return comment.save();
    }).then(result => {
        freeboard.comments.push(comment);
        freeboard.commentCount = freeboard.comments.length;
        return freeboard.save();
    }).then(() => {
        return FreeboardComment
            .findOne({_id : comment._id})
            .populate({
                path: 'owner',
                model: 'User',
                select : ['_id', 'username'],
            });
    }).then(currentComment => {
        res.json({ msg: 'save successfully', result : currentComment});
    }).catch(reason => {
        res.status(500).json({ err: 'internal server error' });
    })
}
