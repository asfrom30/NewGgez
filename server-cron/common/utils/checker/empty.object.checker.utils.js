module.exports = function(obj) {
    if(Object.keys(obj).length === 0 && obj.constructor === Object) return true;
    else return false;
}
