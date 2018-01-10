const config = require('../../config/enviroment');
const crawlerUtil = require('../../common/utils/crawler/crawler.common.util');

const heroKeys = require('./crawl.access.keys').heroKeys;

exports.doCrawl = function(crawlConfig, btg) {
    const crawlTargetUrl = config.crawl.baseUrl + crawlConfig.lang
        + "/career/" + crawlConfig.device + "/" + crawlConfig.region + "/" + encodeURI(btg);

    return new Promise((resolve, reject) => {
        crawlerUtil.crawl(crawlTargetUrl, resolve);
    })
}

exports.metaParser = function($) {
    var key = '_meta'
    let result = {};

    // playerIcon
    let iconUrl = $('img.player-portrait', '.masthead-player').attr('src');

    // cptpt
    let cptpt = $('.competitive-rank .u-align-center', '.masthead-player-progression.hide-for-lg').text();
    cptpt = parseInt(cptpt);

    // Player level
    let rankUrl;
    if($('.player-level', '.masthead-player-progression.hide-for-lg').length != 0) {
        rankUrl = $('.player-level', '.masthead-player-progression.hide-for-lg').css('background-image');
    }

    let upperLevelUrl;
    if($('.player-rank', '.masthead-player-progression.hide-for-lg').length != 0) {
        upperLevelUrl = $('.player-rank', '.masthead-player-progression.hide-for-lg').css('background-image');
    }

    let lowerLevel = $('.u-vertical-center', '.masthead-player-progression.hide-for-lg').text();
    lowerLevel = parseInt(cptpt);

    // Crawl Time
    let crawlTimeStamp = Date.now();
    result.iconUrl = iconUrl;
    result.cptpt = cptpt;
    result.rankUrl = rankUrl;
    result.upperLevelUrl = upperLevelUrl;
    result.lowerLevel = lowerLevel;
    result.crawlTimeStamp = crawlTimeStamp;
    
    return { key : key, value : result};
}

exports.heroParser = function($) {
    var key = '_value'
    var result = {};

    for(var hero of heroKeys){
        var context = 'div#competitive div[data-category-id=' + hero.key + ']';
        
        // Don't confuse jqury dom and array... in this npm
        var $_trElems = $('tbody > tr', context);

        var trElems = $_trElems.toArray();
        
        var tempResult = {};

        for(var tr of trElems){
            var keyTd = tr.children[0].children[0].data;
            var valueTd = tr.children[1].children[0].data;
            
            tempResult[keyTd] = valueTd;
        }
        result[hero.id] = tempResult;     // init children value...
    }

    return { key : key, value : result};
}