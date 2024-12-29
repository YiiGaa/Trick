const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseSetting = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require("copy-webpack-plugin");

function componentCheck(target){
    if (!target) {
        console.error(`Module lack, please run like 'npm run component-run -- --env component=xxx`);
        process.exit(1);
    }

    const componentPath = path.resolve(__dirname, '../../Code', 'Component', target, `${target}.js`);
    if (!fs.existsSync(componentPath)) {
        console.error(`Component incorrect, there is not '${target}' in Code/Component`);
        process.exit(1);
    }
    return target;
}

module.exports = (env)=>{ 
    const target = componentCheck(env.component);
    const regex = new RegExp(`Code\/(?:Page|Module|Component(?!\/(?:${target})))`);

    return merge(baseSetting, {
        mode: 'development',
        target: 'web',
        devServer: {open:{ target:[`/index.html`]}},
        entry:[path.resolve(__dirname, `../../Code/Component/${target}/Sample.js`),path.resolve(__dirname, `../../Code/Component/${target}/Sample.html`)],
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `../../Code/Component/${target}/Sample.html`),
                filename: `index.html`
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new webpack.NormalModuleReplacementPlugin(
                regex,
                resource => {
                throw new Error(`This component hava import something(${resource}) in /Code/Page, /Code/Module or /Code/Component(Other component), it is illegal`);
                }
            ),
            (!fs.existsSync(path.resolve(__dirname, `../../Code/Component/${target}/test`)))
                ? null
                : new CopyWebpackPlugin({
                    patterns: [
                        //TIPS::For copy all assets file from 'Component/test'
                        {
                            from: path.resolve(__dirname, `../../Code/Component/${target}/test`),
                            to: 'assets',
                            globOptions: {
                                dot: false,
                                ignore: ['.*']
                            },
                            transform: (content, absoluteFrom) => {
                                console.log()
                                const dirExists = fs.existsSync(path.dirname(absoluteFrom));
                                return dirExists ? content : null;
                            }
                        }
                    ]
                })
        ]
    });
};