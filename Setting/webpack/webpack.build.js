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
const ConvertSPA = require('./webpack.spa.js')
const config = require('./custom.js')

let outputRoot = config["page.output.root.publish"]||"";
outputRoot = path.posix.join('/',outputRoot)

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

//TIPS::Get the variable names that do not need to be compressed
function GetComponent(srcPath) {
    return fs.readdirSync(srcPath)
        .filter(name => {
            const fullPath = path.join(srcPath, name);
            return fs.statSync(fullPath).isDirectory();
        })
}
const componentList = GetComponent(path.resolve(__dirname, '../../Code/Component'))
const reservedList = [...componentList, ...['document', 'window', 'root', 'HTMLDocument', 'HTMLElement', 'HTMLCollection', 'Document', 'Node', 'Element', 'NodeList']];

module.exports = (env) => {
    let exportSetting = merge(baseSetting, {
        mode: 'production',
        devServer: {
            hot: true,
            open: [`/`],
        },
        entry:{},
        //TIPS::For disable map
        target: ['web', 'es5'],
        devtool: false,
        plugins: [
            new webpack.DefinePlugin({
                Trick_ASSETPATH: JSON.stringify(path.posix.join(outputRoot,'assets')),
                Trick_LANGPATH: JSON.stringify(path.posix.join(outputRoot,'lang')),
            }),
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
                    },
                    //TIPS::For copy page assets file
                    {
                        from: 'Code/Page/*/Assets/**/*',
                        to: ({context, absoluteFilename}) => {
                            const relativePath = path.relative(path.resolve(context, 'Code/Page'), absoluteFilename);
                            const parts = relativePath.split(path.sep);
                            const matchedDir = parts[0];
                            const filePathInAssets = parts.slice(2).join(path.sep);
                            return `assets/${matchedDir}/${filePathInAssets}`;
                        },
                        globOptions: {
                            dot: false,
                            ignore: ['.*']
                        },
                        noErrorOnMissing: true
                    }
                ]
            })
        ],
        output: {
            filename: '[name].js',
            assetModuleFilename: 'load/[name].[ext]',
            path: path.resolve(__dirname, path.join('../../Build/',outputRoot)),
            publicPath: path.posix.join(outputRoot,'/'),
            clean: true
        },
        optimization: {
            usedExports: true,
            minimize: true,
            minimizer: [
                //TIPS::Remove comments/console in css/js file
                new TerserPlugin({
                    terserOptions: {
                        format:{comments: false},
                        compress: {
                            drop_console: false,
                            pure_funcs: ['console.debug', 'console.log', 'console.warn']
                        },
                        mangle:{
                            reserved: reservedList
                        }
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
                            const identifier = module.identifier();
                            let moduleFileName = path.basename(identifier);
                            moduleFileName = moduleFileName.split('|')[0];
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
                        test: /[\\/]Common[\\/]Theme[\\/]Theme\.scss/,
                        type: 'css/mini-extract',
                        name:"../config/theme",
                        minSize: 0,
                        chunks: 'all',
                        minChunks: 1
                    },
                    style: {
                        test: /[\\/]Common[\\/]Theme[\\/]Style\.scss/,
                        type: 'css/mini-extract',
                        name:"../page/common/style",
                        minSize: 0,
                        chunks: 'all',
                        minChunks: 1
                    },
                    common: {
                        test: /[\\/]Common[\\/](ErrorCode|Lang|Logger|Tools|Theme)[\\/].*\.js$/,
                        name: 'page/common/common',
                        minSize: 0,
                        chunks: 'all',
                        minChunks: 1
                    }
                }
            }
        }
    });

    //STEP::SPA setting
    if(env.spa){
        exportSetting = ConvertSPA(exportSetting, true)
    }

    //STEP::Get Page entry
    return GetPageEntry(exportSetting);
};