//引入axios http库
import axios from 'axios'

//重新创建自定义实例
//我可以给AXIOS实例添加很多自定义的属性
let http = axios.create({
    // /api是把http://localhost:3000地址重启
    //上线之后可以把基础地址更换成为域名
    baseURL:'/api'
})

//请求拦截
http.interceptors.request.use((config)=>{
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    //全局设置每一个请求头中携带token
    config.headers.authorization =userInfo?userInfo.token:{}
    return config
})

//响应拦截
http.interceptors.response.use((res)=>{
   // console.log(res.data,'响应全局')
    //全局拦截错误
    return res
})

//暴露出http
export default http