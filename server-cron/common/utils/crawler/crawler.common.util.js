/* Module loading */
var Crawler = require('crawler');

exports.crawl = function(url, resolve){
    
    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page 
        callback : function (error, res, done) {
            resolve(res);
            done();
        }
    });
    c.queue(url);
};

/* Jquery selector example in Crawled Page */
// function crawlCallback(res){
//     if(res.statusCode == 200){
//         console.log('Grabbed', res.body.length, 'bytes');
//         var $ = res.$;
//         console.log("--- quick play");
//         console.log($("div#quickplay").text());
//         console.log("--- competitive");
//         console.log($("div#competitive").text())
//     } else {
//         // nothing to do
//     }
// }