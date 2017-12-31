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
        speed : 5,
        limitPlayer : true,
        limitNumber : 100,
    }
}