module.exports = {
    port: function(){
        if(process.env.dryrun) return 9005;
        return process.env.PORT || 9001;
    }(),
    mongo: {
        baseUri  : 'mongodb://localhost/web',
    },
}