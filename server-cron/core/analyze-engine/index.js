exports.analyzeTier = analyzeTier;


function analyzeTier (preResult){
    return new Promise((resolve, reject)=>{
        setTimeout(function(S){
            console.log('anlayze');
            console.log(preResult);
            resolve(preResult);
        }, 1000)
    })
}

