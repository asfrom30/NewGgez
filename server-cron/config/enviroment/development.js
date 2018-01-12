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

    mailing : {
        flag : false,
    }
}