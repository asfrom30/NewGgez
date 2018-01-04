const appDao = require('../../../services/dao');

exports.read = function(req, res, next) {
    const device = req.device;
    const region = req.region;

    appDao.getIndexInformation(device, region).then(result=>{
        res.json({msg : 'send player success', err : '', value : result});
    }, reject => {
        res.status(500).json({msg : '', err : 'internal server error', value : ''})
    })

}
