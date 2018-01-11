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
        flag : true,
        logFlag : false,//TODO: not yet impl
        speed : 5,
        limitFlag : false,
        limitNumber : 100,
    },

    mailing : {
        flag : true 
    }
}