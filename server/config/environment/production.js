module.exports = {
    
    // Server port
    port: process.env.PORT || 9000,

    mongo: {
        baseUri  : 'mongodb://localhost/web',
    },
}