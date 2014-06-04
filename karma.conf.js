// Karma configuration
// Generated on Mon Dec 02 2013 18:46:27 GMT+0400 (MSK)

// uncomment this for redefine mp3-reporter sound files
// ====================================================
// var path = require('path');
// var karmaSoundDir = path.join(__dirname, 'karma_sound');
// ====================================================

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/sinon/pkg/sinon.js',                    // sinon will be accessable from global context
      {pattern: 'node_modules/**/*.js', included: false},   // allow to load any *.js from node_modules by karma web-server

      'test/test-main.js',
      {pattern: 'js/spec/*.js', included: false},
      {pattern: 'js/lib/**/*.js', included: false},
      {pattern: 'js/vendor/*.js', included: false},
      {pattern: 'test/*.js', included: false}
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'mp3', 'html'],

    // uncomment this for redefine mp3-reporter sound files
    // ====================================================
    // mp3Reporter: {
    //   red:        path.join(karmaSoundDir, 'red.mp3'),
    //   green:      path.join(karmaSoundDir, 'green.mp3'),

    //   fail:       path.join(karmaSoundDir, 'fail.mp3'),
    //   error:      path.join(karmaSoundDir, 'error.mp3'),
    //   success:    path.join(karmaSoundDir, 'success.mp3'),
    //   disconnect: path.join(karmaSoundDir, 'success.mp3'),
    // },
    // ====================================================

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
