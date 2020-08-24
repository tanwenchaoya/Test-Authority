import axios from 'axios'
import Qs from 'qs'
// import Vue from 'vue'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://182.149.198.169:8888/api'
// axios.defaults.baseURL = 'http://172.16.20.5:8888'
axios.defaults.timeout = 5000
// axios.defaults.withCredentials = true
axios.interceptors.request.use(
  config => {
    // config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
/*
axios.interceptors.response.use(
  response => { // 成功请求到数据
    count--
    if (count === 0) {
      Vue.hiddenLoading()
    }
    return response
  },
  error => { // 响应错误处理
    Vue.hiddenLoading()
    return Promise.reject(error)
  }
) */
export default {
  get: function (path = '', data = {}) {
   if (window.sessionStorage.getItem('sessionId')){
     data['sessionId']=window.sessionStorage.getItem('sessionId');
    }
    return new Promise(function (resolve, reject) {
      axios.get(path, {
        params: data
      })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  post: function (path = '', data = {}) {
    const sessionId = window.sessionStorage.getItem('sessionId');
    if (window.sessionStorage.getItem('sessionId')){
        data['sessionId']=sessionId;
    }
    return new Promise(function (resolve, reject) {
      axios.post(path, Qs.stringify(data),{headers:{ 'content-type': 'application/x-www-form-urlencoded' }})
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  all: function (list) {
    return new Promise(function (resolve, reject) {
      axios.all(list)
        .then(axios.spread(function (...result) {
          // 两个请求现在都执行完成
          resolve(result)
        }))
        .catch(function (error) {
          reject(error)
        })
    })
  }
}
