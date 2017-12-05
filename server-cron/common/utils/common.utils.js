

/* Checker */
const stringChecker = require('./checker/string.checker.utils');
const emptyObjChecker = require('./checker/empty.object.checker.utils');
const functionChecker = require('./checker/function.checker.utils')

/* Logger */
const log = require('./logger/logger.utils');

module.exports = {
    isString : stringChecker,
    isEmptyObj : emptyObjChecker,
    isFunction : functionChecker,

    log : log,

}
