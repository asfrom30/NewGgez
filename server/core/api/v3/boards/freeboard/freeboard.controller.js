import { isNumber } from 'util';
import { now } from 'moment';

const logFlag = (process.env.NODE_ENV == 'development') ? true : false;

const util = require('util');
const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');

const freeboardConfig = require('../../../../../config/application').freeboard;
const Freeboard = mongoose.model('Freeboard');
const apiHelper = require('../../../core.api.helper');

exports.findById = function (req, res, next, id) {
    id = parseInt(id);
    req.id = id;

    if (!isNumber(id)) return res.status(400).send();

    Freeboard.findOne({ _id: id }).then(result => {
        if (!result) return apiHelper.sendResourceNotFound(res, 'freeboard', id);
        req.freeboard = result;
        return next();
    }, reason => {
        return sendInternalError(res, reason);
    })
}

exports.save = function (req, res, next) {

    // freeboard form valid check.
    if (req.body == null) res.status(404).json({ err: 'bad_request' });
    const user = req.user;
    const title = req.body.title;
    const content = req.body.content;
    const text = req.body.text;

    //valid check
    const isValid = isFreeboardValid(title, text);
    if (!isValid) return res.status(400).json({ devLogs: "can not pass freeboard valid check", errors: { log2Client: 'freeboard_is_invalid' } });

    // if user role is admin, freeboard notice will be true.
    const doc = { title: title, content: content, text: text, owner: user };
    if (user.role === 'admin') doc.notice = true;

    new Freeboard(doc).save().then(result => {
        res.json(result);
    }, reason => {
        apiHelper.sendInternalServerError(res, reason);
    })
}

exports.read = function (req, res, next) {

    // variables extraction
    const freeboard = req.freeboard;
    const id = req.freeboard._id;

    const populateQuery = [];

    // populate user 
    populateQuery.push({
        path: 'owner',
        select: ['-email', '-password', '-battletag'],
    });

    // populate comments
    populateQuery.push({
        path: 'comments',
        populate: { // nested populate
            path: 'owner',
            model: 'User',
            select: ['-email', '-password', '-battletag'],
        }
    });

    Freeboard
        .findOneAndUpdate({ _id: id }, { $inc: { viewCount: 1 }}, {new: true})
        .populate(populateQuery)
        .exec()
        .then(result => {
            res.json(result);
        }, reason => {
            sendInternalError(res, reason);
        });
}

exports.delete = function (req, res, next) {

    // variables extraction
    const freeboard = req.freeboard;
    const userRole = req.user.role;
    const ownerId = req.freeboard.owner.toString();
    const userId = req.user._id.toString();

    // auth check(owner or admin can delete);
    if (userId != ownerId && userRole != 'admin') return apiHelper.sendUnauthorized(res, 'unauthorized : only admin and owner can delete', 'unauthorized_delete');

    freeboard.remove().then(result => {
        res.json({ datas: { deleteResult: true } });
    }, reason => {
        apiHelper.sendInternalServerError(res, reason);
    })
}

exports.query = function (req, res, next) {

    // prepare query
    const query = {};

    // notice query :: notice=false will have both(notice and not). but notice=true only have notice
    const notice = (req.query.notice == 'true') ? true : false;
    if (notice) query.notice = notice;

    // order query
    const order = req.query.order;
    let orderQuery = { _id: -1 };
    if(order) {
        if(order == 'view') orderQuery = {viewCount : -1};
        if(order == 'vote') orderQuery = {upvoteUserCount : -1};
        if(order == 'comment') orderQuery = {commentCount : -1};
    }

    // date query TODO: need locale(region)
    const region = 'kr'; //FIXME: REGION RELATE.
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const startDateValid = moment(startDate, 'YYYYMMDD', true).isValid();
    const endDateValid = moment(endDate, 'YYYYMMDD', true).isValid();
    if(startDateValid || endDateValid) {
        query.createdAt = {};
        let subtractHours = 0;
        if(region == 'kr') subtractHours = 9;
        if(startDateValid) query.createdAt.$gte = moment.utc(startDate).startOf('date').subtract(subtractHours, 'hours').format();
        if(endDateValid) query.createdAt.$lte = moment.utc(endDate).endOf('date').subtract(subtractHours, 'hours').format();
    }

    // keyword query
    const keyword = req.query.keyword;
    if (keyword) query.$text = { $search: keyword, $diacriticSensitive: true };

    // pageNumber
    let pageNum = req.query.page || 1;
    if (isNaN(pageNum)) pageNum == 1;
    
    const limit = 10;//TODO: NO HARD WIRING
    Freeboard
        .find(query, { content: 0, comments: 0, text: 0 }) // project : no need content and comment
        .sort(orderQuery)
        .skip((pageNum - 1) * limit)
        .limit(limit)
        .populate({
            path: 'owner',
            model: 'User',
            select: ['userName'],
        })
        .then(result => {
            res.json(result);
        }, reason => {
            res.status(500).send({ errMsg: "internal_server_error", errLog: reason });
        });

}

exports.upvote = function (req, res) {

    // check auth
    // freeboard upvote user list... user id save
    const user = req.user;
    const freeboard = req.freeboard;

    const userId = user._id;
    const freeboardId = freeboard._id;
    const upvoteUsers = freeboard.upvoteUsers

    if (!freeboard) return sendResourceNotFound(res, 'freeboard', freeboardId);

    // check already upvote
    const isAlreadyUpvote = upvoteUsers.some(function (upvoteUser) {
        return upvoteUser.equals(userId);
    })
    if (isAlreadyUpvote) return res.status(409).json({ errMsg: 'freeboard_already_upvote', errLog: `already upvote in freeboard(${freeboardId})` });

    freeboard.upvoteUsers.push(user);
    freeboard.upvoteUserCount = freeboard.upvoteUsers.length;

    freeboard.save().then(result => {
        res.json({ result: true, msg: 'freeboard_upvote_success' });
    }, reason => {
        sendInternalError(res, reason);
    });
}

function isFreeboardValid(titleString, contentString) {
    let flag = true;
    if (!validator.isLength(titleString, { min: freeboardConfig.title.min, max: freeboardConfig.title.max })) flag = false;
    if (!validator.isLength(contentString, { min: freeboardConfig.content.min, max: freeboardConfig.content.max })) flag = false;

    return flag;
}

function sendInternalError(res, reason) {
    res.status(500).json({ errMsg: 'internal_server_error', errLog: reason });
}
