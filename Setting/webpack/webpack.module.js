const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseSetting = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

function moduleCheck(target){
    if (!target) {
        console.error(`Module lack, please run like 'npm run module-run -- --env module=xxx`);
        process.exit(1);
    }

    const modulePath = path.resolve(__dirname, '../../Code', 'Module', target, `${target}.js`);
    if (!fs.existsSync(modulePath)) {
        console.error(`Module incorrect, there is not '${target}' in Code/Module`);
        process.exit(1);
    }
    return target;
}

module.exports = (env)=>{ 
    const target = moduleCheck(env.module);
    const regex = new RegExp(`Code\/(?:Page|Component|Module(?!\/(?:${target})))`);

    return merge(baseSetting, {
        mode: 'development',
        target: 'web',
        devServer: {open:{ target:[`/index.html`]}},
        entry:[path.resolve(__dirname, `../../Code/Module/${target}/Sample.js`),path.resolve(__dirname, `../../Code/Module/${target}/Sample.html`)],
        plugins: [
            new webpack.DefinePlugin({
                Trick_ASSETPATH: JSON.stringify('assets'),
                Trick_LANGPATH: JSON.stringify('lang'),
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `../../Code/Module/${target}/Sample.html`),
                filename: `index.html`
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new webpack.NormalModuleReplacementPlugin(
                regex,
                resource => {
                throw new Error('This module hava import something in Code/Page or Code/Module(Other module), it is illegal');
                }
            )
        ]
    });
};