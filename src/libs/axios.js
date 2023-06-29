import axios from 'axios'
import store from '@/store'
import router from '../router'
import { getInitSpanMillis, getLocalPid } from '../libs/util'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    }
    return config
  }
  interceptors (instance) {
    // 请求拦截
    instance.interceptors.request.use(config => {
        config.headers['T-Init-Span'] = getInitSpanMillis();
        return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(response => {
        console.log(response)
        if (response.data.code === 1005) {
            store.commit("exit");
            router.push({ name: "home", query: { pid: getLocalPid() } });
        }
        return response
    }, error => {
        if (error && error.response) {
            console.log(error)
            return Promise.reject(error)
        }
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
