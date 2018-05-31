module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.11.2',
            'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.js',
            'src/**/*.js',
            'test/**/*.js'
        ],
        reporters: ['progress'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        // autoWatch: true,
        // usePolling: true,
        singleRun: true,
        concurrency: 3
    });
};
