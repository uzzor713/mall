//axios基础的封装
import axios from "axios";
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus';
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

const httpInstance = axios.create({
  baseURL:'https://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 10000
})

//拦截器

//axios请求拦截器
httpInstance.interceptors.request.use(
  config => {
  //1.从pinia获取token数据
  const userStore = useUserStore()
  //2.按照后端的要求拼接token数据
  const token = userStore.userInfo.token
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
},e => Promise.reject(e))

//axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
  const userStore = useUserStore()
  //统一错误提示
  ElMessage({
    type:'warning',
    message: e.response.data.message
  })
  //401token失效处理
  if(e.response.status === 401){
    userStore.clearUserInfo()
    router.push('/login')
  }
  return Promise.reject(e)
})


export default httpInstance
