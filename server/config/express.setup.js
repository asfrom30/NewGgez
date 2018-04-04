const path = require('path');
const compress = require('compression');
const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const exphbs = require('express-handlebars');

const methodOverride = require('method-override');
const validator = require('express-validator');
// import shrinkRay from 'shrink-ray';
// import errorHandler from 'errorhandler';
// import lusca from 'lusca';
// import passport from 'passport';
// import mongoose from 'mongoose';

const config = require('./environment');
const passportSetup = require('./passport.setup');

/* Set Middle Ware */
export default function (app) {
    var env = app.get('env');

    if (env === 'development' || env === 'test') {
        app.use(express.static(path.join(config.root, '.tmp')));
    }

    if (env === 'production') {
        try {
            app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
        } catch (error) {
            // console.log(error);
        }
    }

    if (env == 'development') {
        // morgan must be declared before webpack and static...
        app.use(morgan('dev')); // morgan is HTTP request logger middleware for node.js
    }

    if (env == 'production') {
        app.use(compress());
    }

    // Set cors
    if (env !== 'production') {
        console.info('set up complete cross origin for resource sharing');
        app.use(cors());
    }

    // set node variable
    app.set('appPath', path.join(config.root, 'client'));

    // set serve static
    app.use(express.static(app.get('appPath')));

    // Set default view engines
    app.set('views', path.join(__dirname, '../views'));
    app.engine('handlebars', exphbs( /* { defaultLayout: 'layout' } */));
    app.set('view engine', 'handlebars');

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

    // method override setting
    app.use(methodOverride());

    // cookie and body parser setting
    app.use(bodyParser.json({limit: '1mb'}));
    app.use(bodyParser.urlencoded({
        limit: '1mb',
        extended: true, // This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true)
    }));
    app.use(cookieParser());
    app.use(validator());

    // session setting
    /* Persist sessions with MongoStore / sequelizeStore
    We need to enable sessions for passport-twitter because it's an
    oauth 1.0 strategy, and Lusca depends on sessions */
    app.use(session({
        secret: config.secrets.session,
        saveUninitialized: true,
        resave: false,
        store: new MongoStore({
            url: config.mongo.defaultUri + 'sessions',
            db: config.mongo.collectionName.sessions,
        })
    }));

    // passport setting
    passportSetup(app);


    //TODO: REMAINING SETTING
    // app.use(shrinkRay());

    /* Build Client using webpack middle-ware */
    const needWebpack = true;
    if (!needWebpack) console.warn('Webpack middleware flag is off');
    if (needWebpack && process.env.NODE_ENV === 'development') {
        console.info('Webpack middleware is running');

        const webpack = require('webpack');
        const stripAnsi = require('strip-ansi');
        const webpackDevMiddleware = require('webpack-dev-middleware');
        const webpackDevConfig = require('../../.webpack/webpack.dev');
        const compiler = webpack(webpackDevConfig);
        const browserSync = require('browser-sync').create();

        browserSync.init({
            open: false,
            logFileChanges: false,
            proxy: `https://localhost:${config.port}`,
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
        compiler.plugin('done', function (stats) {
            console.log('webpack done hook');
            if (stats.hasErrors() || stats.hasWarnings()) {
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

    console.log('express setting ');
}
