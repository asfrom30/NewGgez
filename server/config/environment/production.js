module.exports = {
    
    // Server port
    port: process.env.PORT || 9001,

    mongo: {
        baseUri  : 'mongodb://localhost/web',
    },
}