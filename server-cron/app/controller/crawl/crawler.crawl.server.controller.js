var Config = require('../../../config/config');
var appCrawler = require('../../utils/crawler.crawl.server');

const heroKeys = require('../../const/crawl.access.keys').heroKeys;

exports.doCrawl = function(lang, device, region, btg){
    var crawlTargetUrl = Config.targetUrl + lang + "/career/" + device + "/" + region + "/" + encodeURI(btg);
    
    /* Register Parser */
    let domParsingCallback = new DomParsingCallback();
    domParsingCallback.registerParser(this.heroParser);
    domParsingCallback.registerParser(this.metaParser);

    return new Promise(function(resolve, reject){
        //FIXME: reject param must be passed `crawl()` method...
        appCrawler.crawl(crawlTargetUrl, domParsingCallback, resolve);    // crawler module not support promise
    });
}

function DomParsingCallback(res, resolve){

    this.parsers = [];

    this.registerParser = function(parser) {
        this.parsers.push(parser);
    }

    this.parse = function(res, resolve) {
        var result = {};

        //TODO: parseInt, heroName, if data is null, exception handle...
        if(res.statusCode == 200){
            var $ = res.$;
            for(parser of this.parsers) {
                var parsedObj = parser($);
                result[parsedObj.key] = parsedObj.value;
            }
        } else {
            // Nothing to do. If Status code with error occured. Empty Object will be stroed in Database.
        }
        resolve(result);
    }
}


exports.metaParser = function($) {
    var key = '_meta'
    let result = {};

    // playerIcon
    let iconUrl = $('img.player-portrait', '.masthead-player').attr('src');

    // cptpt
    let cptpt = $('.competitive-rank .u-align-center', '.masthead-player-progression.hide-for-lg').text();

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
            
            saveKeyAndValue(tempResult, keyTd, valueTd);
            // result[value][keyTd] = valueTd;
        }
        result[hero.id] = tempResult;     // init children value...
    }

    return { key : key, value : result};
}


function saveKeyAndValue(result, keyTd, valueTd){
    result[keyTd] = valueTd;
}
