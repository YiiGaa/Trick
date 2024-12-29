//STEP::Set proxy settings
module.exports = {
    devServer: {
        proxy:[
            {
                context: ['/api'],
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
                cookiePathRewrite: {
                    '^/api': '/'
                },
            }
        ]
    }
};