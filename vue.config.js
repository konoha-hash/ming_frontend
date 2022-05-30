module.exports = {
    devServer: {
        open: true,
        hot: true,
        compress: true,
        disableHostCheck: true,
        proxy: {
            '/share': {
                target: 'http://localhost:7070/',
                pathRewrite: { '^/share': '/share/' },
                changeOrigin: true, //跨域
                secure: false, // 使用的是http协议则设置为false，https协议则设置为true
                ws: true
            }
        }
    },
}