




function getOuterPromiseChain() {
    return new Promise((resolve, reject) => {
        throw new Error('outer promise chain error');
        resolve('outer promise chain result');
    })
}

new Promise((resolve, reject) => {

    resolve();
    console.log('hi2')
}).then(result => {
    console.log('hi');
})


// getOuterPromiseChain().then(result => {
//     console.log('result');
// }, reject => {
//     console.log('reason');
// }).catch(reason => {

// }).then(result => {

// })

/* Useful Pattern */
return new Promise((resolve, reject) => {
    appDao.getCrawlDataCount(device, region, suffix).then(result => {
        // throw new Error('hielasdf');
        return Promise.reject('helloo');
    }).then(result => {
        console.log('working?')
    }).catch(reason => {
        console.log(reason);
    })
}).catch(reason => {
    
})

/* Same Pattern */
return appDao.getCrawlDataCount(device, region, suffix).then(result => {
// throw new Error('hielasdf');
        return Promise.reject('helloo');
    console.log('0');
}).then(result => {
    console.log('1');
}).catch(reason => {
    console.log('2');

});

// return new Promise((resolve, reject) => {
//     appDao.getCrawlDataCount(device, region, suffix).then(result => {
//         // throw new Error('hielasdf');
//         return Promise.reject('helloo');
//     }).then(result => {
//         console.log('working?')
//     }).catch(reason => {
//         reject();
//         console.log(reason);
//     })
// }).catch(reason => {
//     console.log('finish tier can not get tier data');
// })