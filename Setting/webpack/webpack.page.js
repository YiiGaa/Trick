const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseSetting = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

function GetPageEntry(exports) {
    let isEmpty = true;
    const dir = path.resolve(__dirname, `../../Code/Page`);
    const pageList = []

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
                pageList.push(file);
            }
        }catch(e){
            //skip illegal file
        }
    });

    //STEP::Create page index
    let indexHtml = "";
    for (const item of pageList) {
        indexHtml += `<li style="font-size:18px;margin:7.5px 0;"><a href="/${item}.html">${item}</a></li>`
    }
    exports['plugins'].push(
        new HtmlWebpackPlugin({
            filename: 'trick-page-index.html',
            templateContent: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0">
                    <div style="display: flex;height: 100vh;align-items: center;justify-content: center;flex-direction:column;">
                        <div style="min-height: 50vh">
                            <h1>Trick Page index:</h1>
                            ${indexHtml}
                        </div>
                    </div>
                </body>
                </html>
            `,
            chunks: []
        })
    )

    //WHEN::No page
    if(isEmpty){
        console.error(`There is not page in Code/Page`);
        process.exit(1);
    }

    return exports;
}

module.exports = merge(baseSetting, {
    mode: 'development',
    devServer: {
        open:true,
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: '/trick-page-index.html' }
            ]
        }
    },
    entry:{},
    plugins: [
        new MiniCssExtractPlugin({
            filename: "page/[name].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
                //TIPS::For copy lang file
                {
                    from: path.resolve(__dirname, '../../Code/Page/*/Lang/*.json'),
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
    ]
});

module.exports = GetPageEntry(module.exports);