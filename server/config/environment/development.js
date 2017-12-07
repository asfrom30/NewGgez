module.exports = {
    // Server port
    port: process.env.PORT || 9000,

    mongo: {
        uri : 'mongodb://localhost/dev_web_pc_kr',
        baseUri  : 'mongodb://localhost/dev_web',
    },
}