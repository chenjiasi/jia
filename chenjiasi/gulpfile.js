const demo = require('./demo');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify');
const rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
const connect = require('gulp-connect');
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        port: 8888,
        livereload: true
    });
});
gulp.task('default', ['connect', 'watch', 'all']);
gulp.task('minicss', function() {
    gulp.src('app/css/**/*.css')
        .pipe(cleanCSS())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/'))
    console.log('压缩css');
});
gulp.task('minijs', function() {
    gulp.src('app/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
    console.log('压缩js');
});
gulp.task('minihtml', function() {
    gulp.src(['rev/*.json', 'app/*.html'])
        .pipe(revCollector({
            dirReplacements: {
                'css': 'css',
                'js': 'js'
            }
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
    console.log('压缩html');
});
gulp.task('watch', function() {
    gulp.watch('app/*.html', ['minihtml']);
    gulp.watch('app/**/*.css', ['minicss']);

})
gulp.task('all', ['minicss', 'minihtml', 'minijs'], function() {
    console.log('任务执行完成');
});