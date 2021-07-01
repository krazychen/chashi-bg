import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 自动填充必要字段
    if (config.data) {
      if (config.data.createTime) {
        config.data.createTime = undefined
      }
      if (config.data.updateTime) {
        config.data.updateTime = undefined
      }
      if (config.data.version) {
        config.data.version = undefined
      }
      if (config.data.deleted === undefined) {
        config.data.deleted = 0
      }
      if (config.data.createBy) {
        config.data.createBy = undefined
      }
      if (config.data.updateBy) {
        config.data.updateBy = undefined
      }
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(res)
    // post导出excel
    if (response.data.type === 'application/vnd.ms-excel') {
      const link = document.createElement('a')
      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', decodeURI(response.headers['filename']))
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      // console.log('--here')
      // Message({
      //   message: res.msg || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 500: 操作失败; 5104: 登陆授权异常; 4000: 登陆失败;5103:验证码校验异常 401: token失效
      if (res.code === 500 || res.code === 5104 || res.code === 5103 || res.code === 4000) {
        // to re-login
        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        const msg = res.msg || 'You have been logged out, you can cancel to stay on this page, or log in again'
        // const msg = '当前登录状态已过期，请重新登陆！' || 'You have been logged out, you can cancel to stay on this page, or log in again'
        MessageBox.confirm(msg, '操作失败', {
          confirmButtonText: '重新登入',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        return Promise.reject(new Error(msg || 'Error'))
      }
      if (res.code === 401 || (res.msg !== undefined && (res.msg.indexOf('JWT Token已过期') !== -1))) {
        // to re-login
        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        // const msg = res.msg || 'You have been logged out, you can cancel to stay on this page, or log in again'
        const msg = '当前登录状态已过期，请重新登陆！' || 'You have been logged out, you can cancel to stay on this page, or log in again'
        MessageBox.confirm(msg, '操作失败', {
          confirmButtonText: '重新登入',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        return Promise.reject(new Error(msg || 'Error'))
      }
      if (res.code === 5000 || res.code === 5001 || res.code === 5002 || res.code === 5003 || res.code === 5100 || res.code === 5101 || res.code === 5102 || res.code === 5104 || res.code === 5105 || res.code === 5106) {
        MessageBox.alert(res.msg || 'Error').then(r => {

        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
      // // 401: token失效
      // if (res.code === 401) {
      //   Message({
      //     message: res.msg || 'Error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
      const config = error.config
      // If config does not exist or the retry option is not set, reject
      if (!config || !config.retry) return Promise.reject(error)

      // Set the variable for keeping track of the retry count
      config.__retryCount = config.__retryCount || 0

      // Check if we've maxed out the total number of retries
      if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(error)
      }

      // Increase the retry count
      config.__retryCount += 1

      // Create new promise to handle exponential backoff
      var backoff = new Promise(function(resolve) {
        setTimeout(function() {
          resolve()
        }, config.retryDelay || 1)
      })

      // Return the promise in which recalls axios to retry the request
      return backoff.then(function() {
        return axios(config)
      })
    } else if (error.response.status === 401) {
      const msg = '操作失败, 重新登入'
      MessageBox.confirm(msg, '操作失败', {
        confirmButtonText: '重新登入',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    // Message({
    //   message: error.msg,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
