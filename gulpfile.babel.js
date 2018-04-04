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

import grunt from 'grunt';
import open from 'open';
import { Server as KarmaServer } from 'karma';
import { protractor, webdriver_update } from 'gulp-protractor';
import { Instrumenter } from 'isparta';

var plugins = gulpLoadPlugins();
var config;

// local shell
import localShell from 'gulp-shell';

// ssh and remote shell
import GulpSSH from 'gulp-ssh';
import GulpSshConfig from './.secrets/ssh/bluehost/config';
var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: GulpSshConfig
});

const clientPath = 'client';
const serverPath = 'server';
const cronPath = 'server-cron';

const paths = {
    secrets: `.secrets/**`,
    package: {
        root: [`package.json`, `package-lock.json`],
        dist: [`dist/package.json`, `dist/package-lock.json`]
    },
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
        ],
        extras: [
            `${serverPath}/**/!(*.js)`,
            `!${cronPath}/node_modules/**`,
        ],
        test: {
            integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
            unit: ['mocha.global.before.js', `${serverPath}/**/*.spec.js`, 'mocha.global.after.js']
        }
    },
    cron: {
        scripts: [
            `${cronPath}/**/!(*.spec|*.integration).js`,
            `!${cronPath}/node_modules/**`,
        ],
        extras: [
            `${cronPath}/**/!(*.js)`,
            `!${cronPath}/node_modules/**`,
        ],
        test: {
            integration: [`${cronPath}/**/*.integration.js`, 'mocha.global.js'],
            unit: ['mocha.global.before.js', `${cronPath}/**/*.spec.js`, 'mocha.global.after.js']
        }
    },
    karma: 'karma.conf.js',
    dist: 'dist',
    logs: {
        ssh: './.logs/ssh'
    }
};

const remotePath = {
    bluehost: {
        node: '/home/ggezkr/node',
        dryrun: '/home/ggezkr/node-dryrun'
    }
}

// TODO:gulp file splitting
// import remoteDryrun from './.gulp/remote/dryrun.remote';

/********************
 * Reusable pipelines
 ********************/
let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './server/mocha.conf'
        ]
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
        vars: { NODE_ENV: 'test' }
    });
});

gulp.task('env:prod', () => {
    plugins.env({
        vars: { NODE_ENV: 'prod' }
    });
});


/*************
 * Build Tasks
 *************/
gulp.task('build:all', cb => {
    return runSequence(
        'clean:dist',
        ['update:package', 'copy:.secrets', 'build:server', 'build:client', 'build:cron'],
        'npm:install:dist',
        cb
    )
});

gulp.task('build:all:!node_modules', cb => {
    return runSequence(
        'clean:dist:!node_modules',
        ['update:package', 'copy:.secrets', 'build:server', 'build:client', 'build:cron'],
        cb
    )
});


// gulp.task('build', cb => {
//     runSequence(
//         [
//             'clean:dist',
//             'clean:tmp'
//         ],
//         'inject',
//         'transpile:server',
//         [
//             'build:images'
//         ],
//         [
//             'copy:extras',
//             'copy:assets',
//             'copy:fonts:dist',
//             'copy:dist:server:extras',
//             'webpack:dist'
//         ],
//         'revReplaceWebpack',
//         cb);
// });

gulp.task('build:server', cb => {
    return runSequence(
        'clean:dist:server',
        ['transpile:server', 'copy:dist:server:extras'],
        cb
    )
});

// includes cron package.json update for standalone
gulp.task('build:cron', cb => {
    return runSequence(
        'clean:dist:cron',
        ['transpile:cron', 'copy:dist:cron:extras'],
        cb
    )
})

gulp.task('build:client', cb => {
    return runSequence(
        'clean:dist:client',
        // 'inject', // no need any more
        'build:images',
        [
            'copy:extras',
            'copy:assets',
            'copy:fonts:dist',
            'webpack:dist'
        ],
        'revReplaceWebpack',
        cb
    )
})

gulp.task('build:client:simple', cb => {
    return runSequence(
        'clean:dist:client:simple',
        'inject',
        [
            'copy:extras',
            'webpack:dist'
        ],
        'revReplaceWebpack',
        // inject,
        cb
    )
});

/********************
 * Run Tasks
 ********************/
/** development run */
gulp.task('serve', cb => {
    runSequence(
        [
            'clean:tmp',
            // 'lint:scripts',
            // 'inject',
            'copy:fonts:dev',
            'env:all'
        ],
        // 'webpack:dev', // If this option is enabled, webpack files saved in .tmp folder
        ['start:server:dev', 'start:client'],
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

gulp.task('serve:dist', localShell.task('cd dist && npm run server:prod'));

gulp.task('serve:bluehost:dryrun', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.dryrun}`
            , 'npm install -- production'
            , `npm run server:dryrun`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh));
});

/** remote prodrun and dryrun */
gulp.task('remote:bluehost:run:server', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.node}`
            , 'npm install'
            , `npm run server:prod`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh));
});

gulp.task('remote:bluehost:run:cron', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.node}/${cronPath}`
            , 'npm install'
            , `npm run pm2:prod`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh))
});

/********************
 * Deploy Tasks
 ********************/

gulp.task('deploy:all', cb => {
    runSequence(
        cb
    );
});

gulp.task('deploy:all:dryrun', cb => {
    runSequence(
        'remote:bluehost:clean:dryrun',
        'remote:bluehost:copy:dryrun',
        cb,
    );
})

gulp.task('deploy:client', cb => {
    runSequence(
        'remote:bluehost:clean:client', // clean all aseets and js files
        'remote:bluehost:copy:client',
        cb
    );
});

gulp.task('deploy:client:simple', cb => {
    runSequence(
        'remote:bluehost:copy:client:simple',
        cb,
    );
});


/********************
 * Auto Tasks - build, deploy, run
 ********************/
gulp.task('auto:deploy:all', cb => {
    runSequence(
        // run server
        'build:all',
        // 'deploy:all',
        // install nodemodules and child node modules
        // run server
    );
});

gulp.task('auto:deploy:all:dryrun', cb => {
    runSequence(
        'build:all:!node_modules',
        'deploy:all:dryrun',
        'serve:bluehost:dryrun',
        cb,
    );
});

gulp.task('auto:deploy:server', cb => {
    runSequence(
        'build:server',
        'remote:bluehost:clean:package.json', // run sequence need cb param for next task.
        'remote:bluehost:clean:server',
        'remote:bluehost:copy:server',
        'remote:bluehost:copy:package.json',
        'remote:bluehost:run:server',
        cb
    )
});

gulp.task('auto:deploy:cron', cb => {
    runSequence(
        'build:cron',
        /*TODO: pm2 stop needed */
        /* clean remote */
        'remote:bluehost:clean:cron', // clean without node_modules.
        /* move dev to remote file */
        'remote:bluehost:copy:cron',
        'remote:bluehost:copy:pm2',
        'remote:bluehost:copy:smtp',
        /* remote run (install and run pm2)*/
        'remote:bluehost:run:cron',
        cb
    );
});

gulp.task('auto:deploy:client', cb => {
    runSequence(
        'build:client',
        'remote:bluehost:clean:client', // clean all aseets and js files
        'remote:bluehost:copy:client',
        cb
    );
});

gulp.task('auto:deploy:client:simple', cb => {
    runSequence(
        'build:client:simple',
        // 'remote:bluehost:clean:client:simple', //TODO: not yet impl for keep lecacy code
        'remote:bluehost:copy:client:simple',
        cb,
    );
});


/********************
 * Tasks
 ********************/

gulp.task('start:server:dev', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:dist', () => {
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

gulp.task('update:package', cb => {
    return runSequence(
        'clean:dist:package.json',
        'copy:dist:package.json',
        cb
    )
})

/* npm install */
gulp.task('npm:install:dist', localShell.task('cd dist && npm install --production'));

/* Clean */
gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));
// clean dist folder except node_modules, server-cron node_modules
gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`,], { dot: true }));
gulp.task('clean:dist:!node_modules', () => del([`${paths.dist}/!(.git*|.openshift|Procfile|node_modules)**`, `!${paths.dist}/${cronPath}`, `!${paths.dist}/${cronPath}/node_modules`], { dot: true }));
gulp.task('clean:dist:package.json', () => del(paths.package.dist, { dot: true }));
gulp.task('clean:dist:server', () => del([`${paths.dist}/${serverPath}/**`], { dot: true }));
gulp.task('clean:dist:cron', () => del([`${paths.dist}/${cronPath}/!(.git*|.openshift|Procfile|node_modules)**`], { dot: true }));
gulp.task('clean:dist:client', () => del([`${paths.dist}/${clientPath}/**`], { dot: true }));
gulp.task('clean:dist:client:simple', () => del([`${paths.dist}/${clientPath}/!(assets)`], { dot: true }));

/**
 * Copy and Transpile Files
 */

/* Copy common secrets */
gulp.task('copy:.secrets', () => {
    return gulp.src(paths.secrets, { cwdbase: true })
        .pipe(gulp.dest(paths.dist));
})

/* Server */
/* move root package.json files */
gulp.task('copy:dist:package.json', () => {
    return gulp.src(paths.package.root, { cwdbase: true })
        .pipe(gulp.dest(paths.dist));
});
/* Transpile Javascript files (move server files without spec.js to dist) */
gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts), { dot: true })
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});
/* Copy all files to server folder(html, json... those type of files can not be transfiled. just copy and move) */
gulp.task('copy:dist:server:extras', () => {
    return gulp.src(paths.server.extras, { cwdbase: true, dot: true, nodir: true })
        .pipe(gulp.dest(paths.dist));
});

/* Cron Server */
gulp.task('transpile:cron', () => {
    return gulp.src(_.union(paths.cron.scripts), { dot: true })
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${cronPath}`));
});

// 
gulp.task('copy:dist:cron:extras', () => {
    return gulp.src(paths.cron.extras, { cwdbase: true, dot: true, nodir: true })
        .pipe(gulp.dest(paths.dist));
});

/* Client : Webpack */
gulp.task('webpack:dev', function () {
    const webpackDevConfig = require('./.webpack/webpack.dev');
    return gulp.src(webpackDevConfig.entry.bundle)
        .pipe(plugins.plumber())
        .pipe(webpack(webpackDevConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('webpack:dist', function () {
    const webpackDistConfig = require('./.webpack/webpack.prod');
    return gulp.src(webpackDistConfig.entry.bundle)
        .pipe(webpack(webpackDistConfig))
        .on('error', (err) => {
            this.emit('end'); // Recover from errors
        })
        .pipe(gulp.dest(`${paths.dist}/client`));
});

gulp.task('webpack:test', function () {
    const webpackTestConfig = require('./.webpack/webpack.test');
    return gulp.src(webpackTestConfig.entry)
        .pipe(webpack(webpackTestConfig))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('build:images', () => {
    return gulp.src(paths.client.images)
        .pipe(plugins.imagemin([
            plugins.imagemin.optipng({ optimizationLevel: 5 }),
            plugins.imagemin.jpegtran({ progressive: true }),
            plugins.imagemin.gifsicle({ interlaced: true }),
            plugins.imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ]))
        // .pipe(plugins.rev())
        // .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
        // base: `${paths.dist}/${clientPath}/assets`,
        // merge: true
        // }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
});

/* */
gulp.task('inject', cb => {
    runSequence(['inject:css'], cb);
});

gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins.inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), { read: false })
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
    return through2.obj(function (file, enc, next) {
        if (!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                this.push(file);
            } catch (e) {
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

gulp.task('revReplaceWebpack', function () {
    return gulp.src('dist/client/app.*.js')
        .pipe(plugins.revReplace({ manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`) }))
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
        'test:server:unit',
        'test:server:integration',
        cb);
});

gulp.task('test:server:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
})

gulp.task('test:server:integration', () => {
    // plugins.env({
    //     vars: {NODE_ENV: 'test'}
    // });
    return gulp.src(paths.server.test.integration)
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


/********************
 * Remote Task
 ********************/

/* Remote clean */
gulp.task('remote:bluehost:clean:package.json', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.node}/${serverPath}`,
        `rm -rf ${remotePath.bluehost.node}/package.json`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh))
})

gulp.task('remote:bluehost:clean:server', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.node}/${serverPath}`,
        `rm -rf ${remotePath.bluehost.node}/${serverPath}`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh))

})

gulp.task('remote:bluehost:clean:cron', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.node}/${cronPath}`,
            `shopt -s extglob`,
        `rm -rf ${remotePath.bluehost.node}/${cronPath}/!(node_modules)`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh))
})

gulp.task('remote:bluehost:clean:client', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.node}/${cronPath}`,
        `rm -rf ${remotePath.bluehost.node}/${clientPath}`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh))
})

gulp.task('remote:bluehost:clean:dryrun', function () {
    return gulpSSH
        .shell([`cd ${remotePath.bluehost.dryrun}`,
        `rm -rf ${remotePath.bluehost.dryrun}`
        ], { filePath: 'shell.log' })
        .pipe(gulp.dest(paths.logs.ssh))
});


/* SSH FILE MOVE : LOCAL TO REMOTE */
gulp.task('remote:bluehost:copy:package.json', function () {
    return gulp
        .src(`${paths.dist}/package.json`)
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}`))
});

gulp.task('remote:bluehost:copy:server', function () {
    return gulp
        .src([`${paths.dist}/${serverPath}/**/*`, `!${paths.dist}/${serverPath}/node_modules/**`], { dot: true })
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}/${serverPath}`))
});

gulp.task('remote:bluehost:copy:cron', function () {
    return gulp
        .src([`${paths.dist}/${cronPath}/**/*`, `!${paths.dist}/${cronPath}/node_modules/**`]) //move all files without spec.js, integration.js, node_modules
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}/${cronPath}`))
});

gulp.task('remote:bluehost:copy:client', function () {
    return gulp
        .src(`${paths.dist}/${clientPath}/**/*`) //move all files without spec.js, integration.js, node_modules
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}/${clientPath}`))
});

gulp.task('remote:bluehost:copy:client:simple', function () {
    return gulp
        .src([`${paths.dist}/${clientPath}/!(assets)`]) // not included other folder, different glop
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}/${clientPath}`))
});

//FIXME: name change needed copy:pm2 -> copy:cron:pm2
gulp.task('remote:bluehost:copy:pm2', function () {
    return gulp
        .src([`${paths.dist}/${cronPath}/.pm2/**`])
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}/${cronPath}/.pm2`))
});

gulp.task('remote:bluehost:copy:smtp', function () {
    return gulp
        .src([`${paths.dist}/${cronPath}/.smtp/**`])
        .pipe(gulpSSH.dest(`${remotePath.bluehost.node}/${cronPath}/.smtp`))
});

gulp.task('remote:bluehost:copy:dryrun', function () {
    return gulp
        .src([`${paths.dist}/**/*`, `!${paths.dist}/node_modules/**`, `!${paths.dist}/${cronPath}/node_modules/**`], { dot: true }) // root node_modules and server-cron node_modules both not moved
        .pipe(gulpSSH.dest(`${remotePath.bluehost.dryrun}`))
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



