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
        flag : false,
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
        tier : false,
        diff : false,
        report : true,
        mail : true,
    }
}