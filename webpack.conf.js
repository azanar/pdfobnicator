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
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
