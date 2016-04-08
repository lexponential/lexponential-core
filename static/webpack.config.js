module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname,
        filename: "./build/app.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    devtool: 'source-map'
};
