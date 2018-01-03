module.exports = {
    
    // Server port
    port: process.env.PORT || 9002,

    mongo: {
        baseUri  : 'mongodb://localhost/test_web',
    },
}