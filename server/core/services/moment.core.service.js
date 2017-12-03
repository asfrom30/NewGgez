const moment = require('moment');
var momentTz = require('moment-timezone');


exports.getCollectionDateIndex = function(){
    var currentDate = momentTz().tz('Asia/Seoul').format('YY-MM-DD');
    return currentDate;
}