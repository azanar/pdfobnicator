const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: __dirname + '/public/js',
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: { 
                        presets: ['@babel/preset-env'] ,
                        plugins: ['babel-plugin-syntax-jsx']
                    }
                }
            },
            {
                test: /\.coffee$/,
                use: {
                    loader: 'coffee-loader',
                    options: { 
                        presets: ['@babel/env'] ,
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.wasm'],
    }
}
