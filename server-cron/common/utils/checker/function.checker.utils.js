// https://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type

module.exports = function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
