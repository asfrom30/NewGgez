exports.analyzeAsync = function() {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('tier');
            resolve();
        }, 1000);
    })
}