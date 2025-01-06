const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const proxySetting = require('./webpack.proxy.js');
const {merge} = require("webpack-merge");

//STEP::Get allow dependencies
let allowDependencies = [];
try {
    allowDependencies = Object.keys(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package-limit.json'), 'utf8')));
} catch (error) {
    console.error(`There is not 'package-limit.json' file(or json format error), which is used to restrict the introduction of lib`);
    process.exit(1);
}

//STEP::Set base settings
module.exports = merge(proxySetting, {
    resolve: {
        alias: {
          '/Code': path.resolve(__dirname, '../../Code'),
        },
    },
    devServer: {
        port: 6789,
        hot: true,
        liveReload: false
    },
    devtool: 'inline-source-map',
    plugins: [],
    output: {
        filename: 'js/[name].js',
        clean: true
    },
    module: {
        rules: [
            //TIPS::Javascript file loading settings
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, '../../Code')],
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                //TIPS::For react
                                '@babel/preset-react',
                                //TIPS::Compatibility handling, the compatibility range is set in package.json
                                [
                                    '@babel/preset-env',
                                    {
                                        "useBuiltIns": "usage",
                                        "corejs": 3
                                    }
                                ]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false,
                            plugins: ["lodash","@babel/plugin-transform-runtime","@babel/plugin-transform-object-rest-spread"]
                        }
                    },{
                        //TIPS::For limit lib import
                        loader: 'restrict-imports-loader',
                        options: {
                            severity: 'error',
                            rules: [
                                {
                                    restricted: new RegExp(`^(?!${allowDependencies.join('|')})`)
                                }
                            ]
                        }
                    }
                ]
            },
            //TIPS::Html file loading settings
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            //TIPS::Css file loading settings
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss')({
                                        config: path.resolve(__dirname, '../tailwind/tailwind.config.js'),
                                    }),
                                    //TIPS::Compatibility handling, the compatibility range is set in package.json
                                    require('autoprefixer'),
                                    require('postcss-preset-env')({
                                        stage: 3,
                                        features: {
                                            'custom-properties': false
                                        }
                                    })
                                ]
                            }
                        }
                    }
                ]
            },
            //TIPS::Scss file loading settings
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss')({
                                        config: path.resolve(__dirname, '../tailwind/tailwind.config.js'),
                                    }),
                                    //TIPS::Compatibility handling, the compatibility range is set in package.json
                                    require('autoprefixer'),
                                    require('postcss-preset-env')({
                                        stage: 3,
                                        features: {
                                            'custom-properties': false
                                        }
                                    })
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            //TIPS::Resource file loading settings
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },{
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },{
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },{
                test: /\.xml$/i,
                use: ['xml-loader'],
            }
        ]
    }
});