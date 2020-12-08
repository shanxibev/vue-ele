// 模块化导入path commn.js
const path = require("path");
// console.log('项目的绝对路径', _dirname);
// 输出绝对路径 C:\Users\平凡的世界\Desktop\vue-houtaiguanli\src\components~
// console.log('某个目录的绝对路径', path.resolve(__dirname, './src/components'));
module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV == 'production' ? '' : '/',
    lintOnSave: false,//是否开启语法检测
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: true,
        // css预设器配置项a
        loaderOptions: {
            scss: {
                prependData: `@import "./src/styles/main.scss";`
            }
        },
    },
    // 配置目录别名
    configureWebpack: (config) => {
        config.resolve = {
            alias: {
                // 获取绝对路径  
                "@": path.resolve(__dirname, './src'),
                "@c": path.resolve(__dirname, './src/components'),
                "@a": path.resolve(__dirname, './src/assets'),
                "@p": path.resolve(__dirname, './public'),
                // 以vue结尾的
                vue$: "vue/dist/vue.esm.js"
            },
            // 引入文件的时候不写后缀，默认加载
            extensions: ['.js', '.json', '.vue']
        }
    },
    // 代理     devSever相当于本地服务器的意思
    devServer: {
        port: 8080,//端口
        open: true, //启动项目打开浏览器
        proxy: {// 代理
        // bugRevel:'debug'//打印node代理的日志
            // http://localhost:8010/api/getSms
            // http://www.web-jshtml.cn/productapi/
            // http://www.web-jshtml.cn/productapi/api/getSms
            '/api': {//以/api开头的都需要代理
                // 启动的目标服务器
                target: 'http://www.web-jshtml.cn/productapi/token/',// http://localhost:8010/api/getSms  目标接口
                // changeOrigin: true,  //是否跨域 自动生成一个localhost:8010 端口，域名下的node服务器，帮忙做代理
                pathRewrite: {// 重新 url
                    '^/api': ''
                }
            }
        }
    }
}

