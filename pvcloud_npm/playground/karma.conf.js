module.exports = function (config) {
    config.set({
        basePath: './',
        files: ['*.js'],
        exclude: [],
        autoWatch: true,
        frameworks: [],
        browsers: ['Chrome'],
        plugins: ['karma-chrome-launcher']
    });
};
