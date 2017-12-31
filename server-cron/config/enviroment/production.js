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
        speed : 5,
        limitPlayer : false,
        limitNumber : 100,
    }
}