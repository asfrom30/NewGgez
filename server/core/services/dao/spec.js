require('babel-core/register');
process.env.NODE_ENV = 'development';

const controller = require('./index');
// controller.findPlayerByBtg('pc', 'kr', '냅둬라날-3934').then(player => {
//     console.log(player)
// });
controller.findPlayerById('pc', 'kr', '1').then(player => {
    console.log(player);
});