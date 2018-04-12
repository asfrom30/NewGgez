
function sendInternalServerError(res, devLogs) {
    res.status(500).json({ devLogs: devLogs, errors: { msg2Client: 'internal_server_error' } });
}

function sendResourceNotFound(res, resourceName, resourceId) {
    res.status(404).json({ devLogs: `can not find ${resourceName}(${resourceId})`, errors: { msg2Client: `${resourceName}_is_not_existed` }});
}

function sendUnauthorized(res, devLogs, msg2Client) {
    res.status(401).json({ devLogs: devLogs, errors: { msg2Client: msg2Client } });// send unauth error
}

// only use for promise process. In other case, just use manual handling
function make4xxReasonWithClientMsg(code, msg2Client) {
    return {
        code: code,
        msg2Client: msg2Client,
    }
}

module.exports = {
    sendInternalServerError: sendInternalServerError,
    sendResourceNotFound : sendResourceNotFound,
    sendUnauthorized : sendUnauthorized,
    make4xxReasonWithClientMsg: make4xxReasonWithClientMsg,
}