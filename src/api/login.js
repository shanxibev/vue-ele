// 请求和响应拦截
import axios from "@/utils/request.js"

// // 对应login下面的文件
// // 请求和响应进行拦截
// // 获取验证码


//获取验证码
export const get_code = (data) => {//post用method，get用method
    // console.log(process.env.NODE_ENV)
    return axios.request({
        method: "post", //post请求
        url: "/getSms/",
        //post请求写 data
        // data:data
        //get请求写 params
        // params: {
        //     firstName: "Fred",
        //     lastName: "Flintstone"
        // }
        data: data
    })
}

// 登录
  
export const do_login = (data)=>{
    return axios.request({
        method:'post',
        url:'/login/',
        data:data
    })
}

// 注册
export const do_registor = (data)=>{
    return axios.request({
        method:'post',
        url:'/register/',
        data:data
    })
}

