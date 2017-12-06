new Promise((resolve, reject) => {
    reject('you are failed');
    return;
    console.log('not reached');
}).then((result) => {
    console.log('second excutes');
}).catch((reason) => {
    console.log(reason);
})

/* What about this?? */
// if(databaseName == undefined) return Promise.reject(new Error('CronJob object, databaseName is null'));
// if(collectionName == undefined) return Promise.reject(new Error('CronJob object, collectionName is null'));
// if(lang == undefined) return Promise.reject(new Error('CronJob object, lang is null'));
// if(device == undefined) return Promise.reject(new Error('CronJob object, device is null'));
// if(location == undefined) return Promise.reject(new Error('CronJob object, location is null'));
// if(btg == undefined) return Promise.reject(new Error('CronJob object, btg is null'));