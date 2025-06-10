const WrapperPlugin = require("wrapper-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

class WrapAllChunksPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('WrapAllChunksPlugin', (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: 'WrapAllChunksPlugin',
                    stage: compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
                },
                (assets) => {
                    for (const assetName in assets) {
                        if (assetName.endsWith('.js')) {
                            const originalSource = compilation.assets[assetName].source();
                            const wrappedSource = `(function(document, window, root, HTMLDocument, HTMLElement, HTMLCollection, Document, Node, Element, NodeList) {${originalSource};})(trickAPP.documentProxy, trickAPP.windowProxy, trickAPP.windowProxy, trickAPP.HTMLDocument, trickAPP.HTMLElement, trickAPP.HTMLCollection, trickAPP.Document, trickAPP.Node, trickAPP.Element, trickAPP.NodeList);`;
                            compilation.updateAsset(
                                assetName,
                                new compiler.webpack.sources.RawSource(wrappedSource)
                            );
                        }
                    }
                }
            );
        });
    }
}

function ConvertSPA(exports, isProduction) {
    //STEP-IN::Convert Js
    if(isProduction)
        exports["plugins"].push(new WrapAllChunksPlugin())
    else
        exports['plugins'].push(
            new WrapperPlugin({
                test: /^page\/[^\/]+\.js$/,
                header: '(function(document, window, root, HTMLDocument, HTMLElement, HTMLCollection, Document, Node, Element, NodeList) {',
                footer: ';})(trickAPP.documentProxy, trickAPP.windowProxy, trickAPP.windowProxy, trickAPP.HTMLDocument, trickAPP.HTMLElement, trickAPP.HTMLCollection, trickAPP.Document, trickAPP.Node, trickAPP.Element, trickAPP.NodeList);'
            })
        )

    //STEP-IN::Convert CSS
    exports['module']['rules'].push(
        {
            test: /\.(css|scss)$/,
            include: [path.resolve(__dirname, '../../Code')],
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            {search: /html(\[trick-theme=[^\]]+\])/g, replace: ':host(div$1)', flags: 'g'},
                            {search: /html(\[dir=[^\]]+\])/g, replace: ':host(div$1)', flags: 'g'},
                            {search: /html\{/g, replace: ':host\{', flags: 'g'},
                            {search: /body\{/g, replace: ':host\{', flags: 'g'}
                        ]
                    }
                }
            ]
        }
    );

    return exports;
}

module.exports = ConvertSPA;