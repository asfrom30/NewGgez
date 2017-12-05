module.exports = function(){
    
    var testA = 'A';
    this.testB = 'B';

    this.buildCronParams = buildCronParams;
}

function buildCronParams(cronJobInfos){
    console.log(testA); // undefined
    console.log(testB); // undefined
    console.log(this.testA); // undefined
    console.log(this.testB); // $ 'B'
}