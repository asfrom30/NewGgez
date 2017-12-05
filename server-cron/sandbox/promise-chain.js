let promises = [];

for(let i=0; i < 10; i++){
    promises.push(delayA);
    promises.push(delayB);
}

function delayA(result){
    return new Promise((resolve, reject) => {
        setTimeout(function(){
            console.log('this is delay function A');
            resolve(result+1);
        }, 100)
    });
}

function delayB(result){
    return new Promise((resolve, reject) => {
        setTimeout(function(){
            console.log('this is delay function B');
            console.log(result);
            resolve(result+1);
        }, 2000)
    });
}

promises.reduce((prePromise, currentPromise, currentIndex, array) => {
    // declare code in this line will excute immediately
    return prePromise.then((result) => { // reduce return
        // declare code in this line will be applied async...
        return currentPromise(result); // promise return;
    })
    
}, Promise.resolve(1));