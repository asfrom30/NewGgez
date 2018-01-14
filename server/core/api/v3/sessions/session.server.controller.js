module.exports = {
    readFavorite : readFavorite,
    addFavorite : addFavorite,
    removeFavorite : removeFavorite,

    readThumb : readThumb,
    addThumb : addThumb,
    removeThumb : removeThumb,
}

function readFavorite(req, res) {
    const device = req.device;
    const region = req.region;
    const favorites = req.session[`favorites_${device}_${region}`];
    if(Array.isArray(favorites)) {
        res.json({err : '', msg : '', value : { favorites : favorites}});
    } else {
        res.json({err : '', msg : '', value : { favorites : []}});
    }
}

function addFavorite(req, res) {
    const device = req.device;
    const region = req.region;
    const favoriteId = parseInt(req.query.id);
    
    if(!Number.isInteger(favoriteId)) {
        res.status(400).json({err: 'id_only_accepted_number', msg : '', value : ''})
        return;
    } else {
        let favorites = req.session[`favorites_${device}_${region}`] || [];
        if(!Array.isArray(favorites)) {
            favorites = [];
        }
        
        if(favorites.indexOf(favoriteId) == -1) {
            favorites.push(favoriteId);
        }

        req.session[`favorites_${device}_${region}`] = favorites;
        res.json({err: '', msg : '', value : true});
    }
}

function removeFavorite(req, res) {
    const device = req.device;
    const region = req.region;
    const favoriteId = parseInt(req.query.id);

    if(!Number.isInteger(favoriteId)) {
        res.status(400).json({err: 'id_only_accepted_number', msg : '', value : false});
        return;
    } else {
        let favorites = req.session[`favorites_${device}_${region}`];
        
        if(Array.isArray(favorites)) {
            const index = favorites.indexOf(favoriteId);
            if(index != -1 ){
                favorites.splice(index, 1);
                req.session[`favorites_${device}_${region}`] = favorites;
            }
        }
        res.json({err: '', msg : 'remove_favorite_success', value : true});
    }
}

function readThumb(req, res) {
    const device = req.device;
    const region = req.region;
    const thumbs = req.session[`thumbs_${device}_${region}`];
    if(Array.isArray(thumbs)) {
        res.json({err : '', msg : '', value : { thumbs : thumbs}});
    } else {
        res.json({err : '', msg : '', value : { thumbs : []}});
    }
}

function addThumb(req, res) {
    const device = req.device;
    const region = req.region;
    const thumbId = parseInt(req.query.id);
    
    if(!Number.isInteger(thumbId)) {
        res.status(400).json({err: 'id_only_accepted_number', msg : '', value : ''})
        return;
    } else {
        let thumbs = req.session[`thumbs_${device}_${region}`] || [];
        if(!Array.isArray(thumbs)) {
            thumbs = [];
        }

        if(thumbs.indexOf(thumbId) == -1) {
            thumbs.push(thumbId);
        }
        
        req.session[`thumbs_${device}_${region}`] = thumbs;
        res.json({err: '', msg : '', value : true});
    }
}

function removeThumb(req, res) {
    const device = req.device;
    const region = req.region;
    const thumbId = parseInt(req.query.id);

    if(!Number.isInteger(thumbId)) {
        res.status(400).json({err: 'id_only_accepted_number', msg : '', value : false});
        return;
    } else {
        let thumbs = req.session[`thumbs_${device}_${region}`];
        
        if(Array.isArray(thumbs)) {
            const index = thumbs.indexOf(thumbId);
            if(index != -1){
                thumbs.splice(index, 1);
                req.session[`thumbs_${device}_${region}`] = thumbs;
            }
        }
        res.json({err: '', msg : 'remove_thumb_success', value : true});
    }
}