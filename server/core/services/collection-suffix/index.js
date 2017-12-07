const momentTz = require('moment-timezone');

exports.getTodaySuffix = function(region) {
    let todaySuffix;
    switch (region) {
        case 'kr':
            todaySuffix = momentTz().tz('Asia/Seoul').format('YYMMDD');
            break;
    
        default:
            todaySuffix = momentTz().tz('Asia/Seoul').format('XXXXXX');
            break;
    }
    return todaySuffix;
}