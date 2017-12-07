const middlewares = [function(req, res, next) {
    next();
    console.log('hello1');
    console.log('hello2');
}, function(req, res, next) {
    res.send({});
}]
router.put('/', middlewares);