module.exports = {
    mongo: {
        baseUri  : 'mongodb://localhost/dev_web',
        collectionName : {
            tierDatas : 'tier-datas',
            crawlDatas : 'crawl-datas',
        }
    },

    cron : {
        context: null,
        start: false,
        runOnInit: true,
    }
}