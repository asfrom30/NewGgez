module.exports = function() {

    const oauthSecret = require('../../.secrets/oauth')

    return {
        oauth : oauthSecret,
    }

}