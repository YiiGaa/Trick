const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseSetting = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

function GetPageEntry(exports) {
    let isEmpty = true;
    const dir = path.resolve(__dirname, `../../Code/Page`);

    //STEP::Find page.html
    fs.readdirSync(dir).forEach(file => {
        const fullJsPath = path.join(dir, file, `${file}UI.js`);
        const fullActionPath = path.join(dir, file, `${file}Action.js`);
        const fullHtmlPath = path.join(dir, file, `${file}.html`);
        try {
            const stat = fs.statSync(fullJsPath);
            if (stat && stat.isFile()) {
                isEmpty = false;
                exports['entry'][file] = {
                    import: [fullJsPath, fullActionPath],
                    filename: `page/${file}.js`
                };
                exports['plugins'].push(
                    new HtmlWebpackPlugin({
                        template: fullHtmlPath,
                        filename: `${file}.html`,
                        chunks: [file]
                    })
                )
                // exports['plugins'].push(
                //     new webpack.DefinePlugin({
                //         TrickPage:JSON.stringify(`${file}`)
                //     })
                // )
                //result.push(merge(exports, page))
            }
        }catch(e){
            //skip illegal file
        }
    });

    //WHEN::No page
    if(isEmpty){
        console.error(`There is not page in Code/Page`);
        process.exit(1);
    }

    return exports;
}

module.exports = merge(baseSetting, {
    mode: 'production',
    devServer: {
        port: 6789,
        hot: true,
        open: [`/`],
    },
    entry:{},
    //TIPS::For disable map
    //devtool: 'source-map',
    devtool: false,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "page/[name].css",
            chunkFilename: '[id].css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                //TIPS::For copy lang file
                {
                    from: 'Code/Page/*/Lang/*.json',
                    to: (pathData) => {
                        const sourcePath = pathData.absoluteFilename;
                        const parts = sourcePath.split(path.sep);
                        const page = parts[parts.length - 3];
                        const lang = parts[parts.length - 1].replace('.json', '');
                        return `lang/${page}-${lang}.json`;
                    }
                },
                //TIPS::For copy assets file
                {
                    from: path.resolve(__dirname, '../../Code/Assets'),
                    to: 'assets',
                    globOptions: {
                        dot: false,
                        ignore: ['.*']
                    }
                }
            ]
        })
    ],
    output: {
        filename: '[name].js',
        assetModuleFilename: 'load/[name].[ext]',
        path: path.resolve(__dirname, '../../Build'),
        clean: true
    },
    optimization: {
        minimize: true,
        minimizer: [
            //TIPS::Remove comments/console in css/js file
            new TerserPlugin({
                terserOptions: {
                    format:{comments: false},
                    compress: {
                        drop_console: true,
                        pure_funcs: ['console.debug', 'console.log', 'console.warn']
                    },
                },
                extractComments: false
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: ['default', {
                        discardComments: { removeAll: true },
                    }]
                }
            })
        ],
        splitChunks: {
            //TIPS::Separate independent files
            cacheGroups: {
                lib: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module, chunks, cacheGroupKey) {
                        const moduleFileName = module
                            .identifier()
                            .split('/')
                            .reduceRight((item) => item);
                        return `${cacheGroupKey}/${moduleFileName}`;
                    },
                    //minSize: 0,
                    chunks: 'all'
                },
                config: {
                    test: /[\\/]Common[\\/]Config[\\/]/,
                    name: 'config/config',
                    minSize: 0,
                    chunks: 'all',
                    minChunks: 1
                },
                theme: {
                    test: /[\\/]Common[\\/]Theme[\\/]Theme.scss/,
                    name:"../config/theme",
                    minSize: 0,
                    chunks: 'all',
                    minChunks: 1
                },
                style: {
                    test: /[\\/]Common[\\/]Theme[\\/]Style.scss/,
                    name:"../page/common/style",
                    minSize: 0,
                    chunks: 'all',
                    minChunks: 1
                },
                common: {
                    test: /[\\/]Common[\\/](ErrorCode|Lang|Logger|Tools)[\\/]/,
                    name: 'page/common/common',
                    minSize: 0,
                    chunks: 'all',
                    minChunks: 1
                }
            }
        }
    }
});

module.exports = GetPageEntry(module.exports);