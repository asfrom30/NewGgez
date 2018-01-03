var compress = require('compression');

/* from full stack */
import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
// import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
// import cookieParser from 'cookie-parser';
// import errorHandler from 'errorhandler';
import path from 'path';
// import lusca from 'lusca';
// import passport from 'passport';
import session from 'express-session';
// import connectMongo from 'connect-mongo';
// import mongoose from 'mongoose';
// var MongoStore = connectMongo(session);

import config from './environment';


/* Set Middle Ware */ 
export default function(app) {
    var env = app.get('env');

    if(env === 'development' || env === 'test') {
        app.use(express.static(path.join(config.root, '.tmp')));
    }
    
    if(env === 'production') {
        try {
            app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
        } catch (error) {
            // console.log(error);
        }
    }

    if(env == 'development') {
        // morgan must be declared before webpack and static...
        app.use(morgan('dev')); // morgan is HTTP request logger middleware for node.js
    }
    
    if (env  == 'production') {
        app.use(compress());
    }

    app.set('appPath', path.join(config.root, 'client'));
    app.use(express.static(app.get('appPath')));

    /* Below code is from angular-fullstack-generator */
    // app.set('views', `${config.root}/server/views`);
    // app.engine('html', require('ejs').renderFile);
    // app.set('view engine', 'html');
    // app.use(shrinkRay());
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(bodyParser.json());
    // app.use(methodOverride());
    // app.use(cookieParser());
    // app.use(passport.initialize());

    /* custom */
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({
        extended : true,
    }))

    app.use(bodyParser.json());
    app.use(methodOverride());

    //TODO: REPLACE WITH COR...
    app.use(function(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })

    /* from angular full stack */
    /* Persist sessions with MongoStore / sequelizeStore
    We need to enable sessions for passport-twitter because it's an
    oauth 1.0 strategy, and Lusca depends on sessions */
    // app.use(session({
    //     secret: config.secrets.session,
    //     saveUninitialized: true,
    //     resave: false,
    //     store: new MongoStore({
    //     mongooseConnection: mongoose.connection,
    //     db: 'web-development-env-setting-complex-ref-css-mocha-chai'
    //     })
    // }));

    /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
    // if(env !== 'test' && !process.env.SAUCE_USERNAME) {
    //     app.use(lusca({
    //     csrf: {
    //         angular: true
    //     },
    //     xframe: 'SAMEORIGIN',
    //     hsts: {
    //         maxAge: 31536000, //1 year, in seconds
    //         includeSubDomains: true,
    //         preload: true
    //     },
    //     xssProtection: true
    //     }));
    // }

    /* Build Client using webpack middle-ware */
    if(process.env.NODE_ENV  === 'development') {
        const webpack = require('webpack');
        const stripAnsi = require('strip-ansi');
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const webpackDevConfig = require('../../webpack.dev');
        const compiler = webpack(webpackDevConfig);
        const browserSync = require('browser-sync').create();


        //FIXME: why without this code. can call assets/images...
        // app.use(webpackDevMiddleware(compiler, {
        //     publicPath: webpackDevConfig.output.publicPath
        // }));
        /**
         * Run Browsersync and use middleware for Hot Module Replacement
         */
        browserSync.init({
          open: false,
          logFileChanges: false,
          proxy: `localhost:${config.port}`,
          ws: true,
          middleware: [
            webpackDevMiddleware(compiler, {
              noInfo: false,
              stats: {
                colors: true,
                timings: true,
                chunks: false
              }
            })
          ],
          port: config.browserSyncPort,
          plugins: ['bs-fullscreen-message']
        });
    
        /**
         * Reload all devices when bundle is complete
         * or send a fullscreen error message to the browser instead
         */
        compiler.plugin('done', function(stats) {
          console.log('webpack done hook');
          if(stats.hasErrors() || stats.hasWarnings()) {
            return browserSync.sockets.emit('fullscreen:message', {
              title: 'Webpack Error:',
              body: stripAnsi(stats.toString()),
              timeout: 100000
            });
          }
          browserSync.reload();
        });
    }

    // if(env === 'development' || env === 'test') {
    //     app.use(errorHandler()); // Error handler - has to be last
    // }
}
