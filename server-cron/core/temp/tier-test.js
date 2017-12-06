/* Enviorment Setting */
let args = process.argv;
let envArg = args[2];

if(!(envArg == 'dev' || envArg == "prod" || envArg == "debug")) {
    console.log('Enviormetn setting is not proper.. ');
    return;
} else {
    process.env.NODE_ENV = envArg;
    // process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
}

var dbConfig = {
    baseUri : 'mongodb://localhost/',
    name : 'pc_kr_web',
}


const appCtrl = require('./app/controller/controller.crawl.server');
appCtrl.buildTierData(dbConfig);