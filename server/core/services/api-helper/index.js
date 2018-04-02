
exports.makeReason = makeReason;

function makeReason(code, error) {
    return {
        code: code,
        errors: [
            error
        ]
    }
}