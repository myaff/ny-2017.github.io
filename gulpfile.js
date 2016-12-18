var gulp = require('gulp'),
	sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    svg = require('gulp-svg-sprite'),
    svg2string = require('gulp-svg2string'),
	cache = require('gulp-cache'),
	runTimestamp = Math.round(Date.now()/1000),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require("browser-sync").create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs');
	
// Source and dest folders
var dest = 'dist/';
var src = {
	scss: 'src/sass/',
	imgs: 'src/images/',
	svg: 'src/images/svg/',
	sprite: 'src/images/sprite/',
	js: 'src/js/',
	libs: 'src/libs/'
}


// Our scss source folder
var scss = {
	in: src.scss + '*.scss',
	out: dest,
	watch: src.sass + '/**/*',
	sassOpts: {
		outputStyle: 'nested',
		precison: 3,
		errLogToConsole: true
	}
};

gulp.task('sass', function(){
	return gulp.src(scss.in)
			   .pipe(sourcemaps.init())
			   .pipe(sass(scss.sassOpts))
			   .pipe(autoprefixer({browsers: ['> 0.5%', 'IE 9', 'IE 10']}))
			   .pipe(sourcemaps.write())
			   .pipe(gulp.dest(scss.out))
			   .pipe(browserSync.reload({stream: true}));
});

gulp.task('svg', function(){
	var svgConfig = {
		shape: {
			dimension: {
				maxWidth: 40,
				maxHeight: 40,
				attributes: false
			},
			spacing: {
				padding: 0
			},
			transform: ['svgo']
		},
		svg: {
			xmlDeclaration      : false,
			doctypeDeclaration  : false
		},
		mode: {
			css: false,
			view: false,
			defs: false,
			stack: false,
			symbol: {
				dest: 'svg',
				sprite: 'sprite.svg',
				bust: false,
				example: true
			}
		}
	};
	return gulp.src(src.svg + '*.svg')
		.pipe(svg(svgConfig))
		.pipe(gulp.dest(dest + 'images'))
		.pipe(svg2string())
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('images', ['svg'], function(){
	var imgminOpts = {
		interlaced: true,
		progressive: true
	};
	gulp.src(src.imgs + 'content/**/*')
		.pipe(cache(imagemin(imgminOpts)))
		.pipe(gulp.dest('images'))
		.pipe(browserSync.reload({stream: true}));
	gulp.src(src.imgs + 'template/**/*')
		.pipe(cache(imagemin(imgminOpts)))
		.pipe(gulp.dest(dest + 'images'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('jslibs', function(){
	return gulp.src([src.libs + 'jquery/dist/jquery.min.js',
					 src.libs + 'modernizr/modernizr-custom.min.js'])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dest + 'js'));
});

gulp.task('js', ['jslibs'], function(){
	return gulp.src(src.js + '/**/*.js')
			   .pipe(concat('scripts.js'))
			   .pipe(gulp.dest(dest + 'js'))
			   .pipe(browserSync.reload({stream: true}));
});

gulp.task('serv', ['sass', 'js'], function(){
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	gulp.watch(src.scss + '**/*.scss', ['sass']);
	gulp.watch(src.js + '*.js', ['js']);
	gulp.watch(src.imgs + '**/*', ['images']);
	gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('default', ['serv']);