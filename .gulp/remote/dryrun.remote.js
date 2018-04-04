import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('auto:deploy:all:dryrun', cb => {
    runSequence(
        'remote:bluehost:clean:dryrun',
        'remote:bluehost:copy:dryrun',
        // install nodemodules and child node modules
        // run server
    );
});
