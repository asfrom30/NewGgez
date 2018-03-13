exports.checkAuth = function(req, res, next) {

    if(!req.isAuthenticated()) {
        return res.status(401).json({err : 'unauthorized'});
    } else {
        return next();
    }
}

