
const compose = require('composable-middleware');

const checkAuth = function (req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).json({ devLogs: 'unauthorized : check auth is false', errors: { msg2Client: 'need_log_in' } });// send unauth error
    next();
}

// router usage : router.get('/role-test', coreCtrl.hasRole());
const hasRole = function () {
    return compose()
        .use(checkAuth)
        .use(function (req, res, next) {
            res.json({});
        })
}

module.exports = {
    checkAuth: checkAuth,
    hasRole: hasRole
}


