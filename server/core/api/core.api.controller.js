exports.checkAuth = function(req, res, next) {

    if(!req.isAuthenticated()) {
        return res.status(401).json({errMsg : 'log_in_please', errLog : 'unauthorized : check auth is false'});
    } else {
        return next();
    }
}

