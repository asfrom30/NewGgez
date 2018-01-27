module.exports = {
    mongo: {
        baseUri  : 'mongodb://localhost/dev_web',
    },

    cron : {
        context: null,
        start: false,
        runOnInit: true,
    },

    crawl : {
        logFlag : false,//TODO: not yet impl
        speed : 8,
        limitFlag : true,
        limitNumber : 10,
    },
    
    logFlag : {
        log2Console : true,
        log2File : true,
        log2Server : true,
    },

    onTickFlags : {
        crawl : false,
        tier : true,
        diff : true,
        report : true,
        mail : true,
    }
}