module.exports = {
    mongo: {
        baseUri  : 'mongodb://localhost/dev_web',
    },

    cron : {
        context: null,
        start: false,
        runOnInit: true,
        // limitCronNumber:
        // cronSpeed
    }
}