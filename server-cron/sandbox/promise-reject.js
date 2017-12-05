new Promise((resolve, reject) => {
    reject('you are failed');
    return;
    console.log('not reached');
}).then((result) => {
    console.log('second excutes');
}).catch((reason) => {
    console.log(reason);
})