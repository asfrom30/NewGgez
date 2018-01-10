const fs = require('fs');
const setInterval = require('timers').setInterval;
const writeFile = require('write');
require('console-stamp')(console, { pattern: 'yy/mm/dd/ HH:MM:ss' });


// const idA = '[a]';
// let countA = 0;
// setInterval(function(){
//     let message = `\r\n${idA}, ${countA}`;
//     fs.appendFile("./test.txt", message, function(err) {
//         if(err) {
//             return console.log(err);
//         }
//     }); 
//     countA++;
// }, 2000);

// const idB = '[b]';
// let countB = 0;
// setInterval(function(){
//     fs.appendFile("./test.txt", `\r\n${idB}, ${countB}`, function(err) {
//         if(err) {
//             return console.log(err);
//         }
//     }); 
//     countB++;
// }, 1000);