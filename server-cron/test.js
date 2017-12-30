const setTimeout = require('timers').setTimeout;

console.log('start');
setTimeout(function(){
    console.log('end');
}, 1000);

