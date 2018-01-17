module.exports = {
    mongo: {
        baseUri  : 'mongodb://localhost/web',
    },

    cron : {
        context: null,
        start: true,
        runOnInit: false,
    },

    crawl : {
        logFlag : false,//TODO: not yet impl
        speed : 5,
        limitFlag : false,
        limitNumber : 20,
    },

    logFlag : {
        log2Console : true,
        log2File : true,
        log2Server : true,
    },

    onTickFlags : {
        crawl : true,
        tier : true,
        diff : true,
        report : true,
        mail : true,
    }
}