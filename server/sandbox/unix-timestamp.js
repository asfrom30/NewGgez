const setInterval = require('timers').setInterval;

// setInterval(function(){
//     console.log(Date.now());
// }, 1000)

const test = new Date(1513922234*1000).toString()
console.log(test);

const timeStampA = Date.now();
const timeStampB = Date.now() - 100;

if(isNaN(timeStampA) || isNaN(timeStampB)) console.log(true);

if(timeStampA - timeStampB > 60) {
    console.log('need to update');
} else {
    console.log('up to date');
}

const result = Number.isInteger(1234.1231);
console.log(parseInt(1234.1231));

console.log('current time stamp');
console.log(Date.now());


1513214729