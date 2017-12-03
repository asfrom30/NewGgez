/**
 * version  : 0.1.0
 * author   : asfrom30@gmail.com
 */
'use strict';

import gulp from 'gulp';
import path from 'path';
import _ from 'lodash';
import nodemon from 'nodemon';
import lazypipe from 'lazypipe';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import http from 'http';
import del from 'del';
import through2 from 'through2';
import webpack from 'webpack-stream';
// import makeWebpackConfig from './webpack.make'; // depreacted in webpack 4.0.

import grunt from 'grunt';
import open from 'open';
import {Server as KarmaServer} from 'karma';
import {protractor, webdriver_update} from 'gulp-protractor';
import {Instrumenter} from 'isparta';

var plugins = gulpLoadPlugins();
var config;

const clientPath = 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        revManifest: `${clientPath}/assets/rev-manifest.json`,
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).js`
        ],
        styles: [`${clientPath}/{app,components}/**/*.css`],
        mainStyle: `${clientPath}/app/app.css`,
        views: `${clientPath}/{app,components}/**/*.html`,
        mainView: `${clientPath}/index.html`,
        test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
        e2e: ['e2e/**/*.spec.js']
    },
    server: {
        scripts: [
          `${serverPath}/**/!(*.spec|*.integration).js`,
          `!${serverPath}/config/local.env.sample.js`
        ],
        json: [`${serverPath}/**/*.json`],
        test: {
          integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
          unit: ['mocha.global.before.js', `${serverPath}/**/*.spec.js`, 'mocha.global.after.js']
        }
    },
    karma: 'karma.conf.js',
    dist: 'dist'
};

/********************
 * Reusable pipelines
 ********************/
let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
    });

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.');

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require(`./${serverPath}/config/local.env`);
    } catch (e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
});

gulp.task('env:test', () => {
    plugins.env({
        vars: {NODE_ENV: 'test'}
    });
});

gulp.task('env:prod', () => {
    plugins.env({
        vars: {NODE_ENV: 'prod'}
    });
});


/********************
 * Main Tasks
 ********************/
gulp.task('serve', cb => {
    runSequence(
        [
            'clean:tmp',
            // 'lint:scripts',
            // 'inject',
            // 'copy:fonts:dev',
            'env:all'
        ],
        // 'webpack:dev', // If this option is enabled, webpack files saved in .tmp folder
        ['start:server', 'start:client'],
        // 'watch',
        cb
    );
});

gulp.task('serve:debug', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'inject',
            'copy:fonts:dev',
            'env:all'
        ],
        'webpack:dev',
        ['start:server:debug', 'start:client'],
        'watch',
        cb
    );
});
 
gulp.task('build', cb => {
    runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
        'inject',
        'transpile:server',
        [
            'build:images'
        ],
        [
            'copy:extras',
            'copy:assets',
            'copy:fonts:dist',
            'copy:server',
            'webpack:dist'
        ],
        'revReplaceWebpack',
        cb);
});


/********************
 * Tasks
 ********************/

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

// .task('start:server:debug', () => {
//     process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//     config = require(`./${serverPath}/config/environment`);
//     // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
//     nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`)
//         .on('log', onServerLog);
// });

gulp.task('start:client', cb => {
    whenServerReady(() => {
        open('http://localhost:' + config.browserSyncPort);
        cb();
    });
});

/* Clean */
gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));
gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile|node_modules)**`], {dot: true}));

/* Server */
/* move server files without spec.js to dist */
gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

/* Move package.json file from dev to dist */
gulp.task('copy:server', () => {
    return gulp.src([
        'package.json'
    ], {cwdbase: true})
        .pipe(gulp.dest(paths.dist));
});

/* Client : Webpack */
gulp.task('webpack:dev', function() {
    const webpackDevConfig = require('./webpack.dev');
    return gulp.src(webpackDevConfig.entry)
        .pipe(plugins.plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:dist', function() {
    const webpackDistConfig = require('./webpack.prod');
    return gulp.src(webpackDistConfig.entry)
        .pipe(webpack(webpackDistConfig))
        .on('error', (err) => {
          this.emit('end'); // Recover from errors
        })
        .pipe(gulp.dest(`${paths.dist}/client`));
});

gulp.task('webpack:test', function() {
    const webpackTestConfig = require('./webpack.test');
    return gulp.src(webpackTestConfig.entry)
        .pipe(webpack(webpackTestConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('build:images', () => {
    return gulp.src(paths.client.images)
        .pipe(plugins.imagemin([
            plugins.imagemin.optipng({optimizationLevel: 5}),
            plugins.imagemin.jpegtran({progressive: true}),
            plugins.imagemin.gifsicle({interlaced: true}),
            plugins.imagemin.svgo({plugins: [{removeViewBox: false}]})
        ]))
        // .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        // .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
            // base: `${paths.dist}/${clientPath}/assets`,
            // merge: true
        // }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('inject', cb => {
    runSequence(['inject:css'], cb);
});

gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
                .pipe(plugins.sort()),
            {
                starttag: '/* inject:css */',
                endtag: '/* endinject */',
                transform: (filepath) => {
                    let newPath = filepath
                        .replace(`/${clientPath}/app/`, '')
                        .replace(`/${clientPath}/components/`, '../components/')
                        .replace(/_(.*).css/, (match, p1, offset, string) => p1);
                    return `@import '${newPath}';`;
                }
            }))
        .pipe(gulp.dest(`${clientPath}/app/inject-test`));
});

/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */
function flatten() {
    return through2.obj(function(file, enc, next) {
        if(!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                this.push(file);
            } catch(e) {
                this.emit('error', new Error(e));
            }
        }
        next();
    });
}
gulp.task('copy:fonts:dev', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${clientPath}/assets/fonts`));
});
gulp.task('copy:fonts:dist', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`));
});

gulp.task('copy:extras', () => {
    return gulp.src([
        `${clientPath}/favicon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/.htaccess`
    ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('revReplaceWebpack', function() {
    return gulp.src('dist/client/app.*.js')
        .pipe(plugins.revReplace({manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)}))
        .pipe(gulp.dest('dist/client'));
});

/* Test */
/* Start all test */
gulp.task('test', cb => {
    return runSequence('test:server', cb);
});

/* Sever Test Task */
gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        // 'mocha:integration',
        cb);
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
})

gulp.task('test:client', done => {
    new KarmaServer({
      configFile: `${__dirname}/${paths.karma}`,
      singleRun: true
    }, err => {
        done(err);
        process.exit(err);
    }).start();
});



/** TODO: test:util */


/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

function checkAppReady(cb) {
    var options = {
        host: 'localhost',
        port: config.port
    };
    http
        .get(options, () => cb(true))
        .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
    var serverReady = false;
    var appReadyInterval = setInterval(() =>
        checkAppReady((ready) => {
            if (!ready || serverReady) {
                return;
            }
            console.log("i'm wating...")
            clearInterval(appReadyInterval);
            serverReady = true;
            cb();
        }),
        100);
}

