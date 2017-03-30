var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var lint = require('gulp-eslint');
var open = require('gulp-open');
var jsmin = require('gulp-jsmin');

var config = {
    port: 8000,
    devBaseUrl: 'http://localhost',
    paths: {
        index: './src/index.html',
        html: './src/app/**/*.html',
        dist: 'dist',
        images: './src/assets/images/*',
        css: [
            './src/assets/css/*.css'
        ],
        js: [
            './src/app/*.js',
            './src/app/**/*.js'
        ],
        mainJs: './src/app/app.module.js',
        dependencias: [
            './node_modules/angular/angular.js',
            './node_modules/angular-route/angular-route.js'
        ]
    }
}

gulp.task('connect', function () {
    connect.server({
        root: [config.paths.dist],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    })
})

gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({ uri: config.devBaseUrl +':'+ config.port + '/'}))

})

gulp.task('html', function () {
    gulp.src(config.paths.index)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist + '/templates'))
        .pipe(connect.reload())
})

gulp.task('js', function () {
    gulp.src(config.paths.js)
        .pipe(concat('bundle.js'))
        .pipe(jsmin())
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload())
})

gulp.task('css', function () {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(connect.reload())
})

gulp.task('dependencies', function () {
    gulp.src(config.paths.dependencias)
        .pipe(concat('dependencies.js'))
        .pipe(jsmin())
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload())
})

gulp.task('images', function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
})

gulp.task('lint', function(){
	return gulp.src(config.paths.js)
		.pipe(lint({config: './eslint.config.json'}))
		.pipe(lint.format());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.js, ['js', 'lint']);
    gulp.watch([config.paths.index,config.paths.html], ['html'])
    gulp.watch(config.paths.css, ['css'])
})

gulp.task('default', ['html', 'js', 'css', 'images', 'lint', 'open', 'watch'])