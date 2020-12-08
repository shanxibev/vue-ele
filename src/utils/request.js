import axios from 'axios'
import { Message } from 'element-ui'//导入
// console.log( process.env.NODE_ENV)
const BASEURL = process.env.NODE_ENV === 'development' ? '/api' : '' //api//线无需代理，线下需要代理，在开发环境需要代理，如果是线上环境的时候我上传的代码和后台在同一服务器，不需要跨域
const http = axios.create({
    baseURL: BASEURL //http://localhost:8080/api/getSms/ 只要是url中/ api代表的都是接口请求，图片。css无需接代理 ，bulid打包
})
// const BASEURL = process.env.NODE_ENV == 'development' ? '/api' : '' //api 做标识
// console.log(BASEURL)
// const http = axios.create({
//     // 等价于下面
//     // baseURL: 'http://www.web-jshtml.cn/productapi/'
//     baseURL: BASEURL //http://localhost:8080/api/getSms 只要url中开头是 /api 都是借口请求
// })
// 跨域 指的是浏览器由于同源策略，不同域名，就会出现跨域，但是如果是两个后台发起网络请求就不存在跨域
// http.defaults.baseURL = 'https://www.baidu.com/' //https://www.baidu.com/getSms
// http.defaults.baseURL = 'http://www.web-jshtml.cn/c/'
// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 手动添加头参数 token userId csrf
    // config.headers.token = 'xxxx'
    // console.log('请求参数', config.headers)
    // console.log(config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {

    //console.log(response);//响应数据
    // 对响应数据做点什么 对数据进行过滤
    if (response.data.resCode != 0) {//resCode:可以进行约定，与后台相关
        // 提示服务器返回的信息
        Message.error(response.data.message) //提示邮箱不能为空！！
        return Promise.reject(error);//把错误信息复制一份，执行错误操作
    }
    return response;//当解决邮箱不能为空时，按成功走
}, function (error) {
    // 对响应错误做点什么
    // console.log('响应拦截')
    return Promise.reject(error);
});

export default http



