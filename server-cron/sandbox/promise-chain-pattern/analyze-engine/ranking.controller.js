exports.analyzeAsync = function() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('ranking');
            resolve();
        }, 2000);
    })
}