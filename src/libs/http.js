import Vue from 'vue'
import Axios from 'axios'
import { baseURL, timeout, headersTokenKey, reLoginUrl  } from '../config'
import store from '../store'
import { Toast, Dialog } from 'vant'
import JSONbig from 'json-bigint'

const axios = Axios.create({
  baseURL: baseURL,
  // timeout: timeout,
  headers: {'Content-Type': 'application/json'},
  transformResponse: [function (data) {
    return JSONbig.parse(data)
  }]
});

// 请求拦截器
axios.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers[headersTokenKey] = store.getters.token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log(response.headers)
    let _headersTokenKey = headersTokenKey.toLowerCase()
    if (response.headers[_headersTokenKey]) {
      let token = response.headers[_headersTokenKey]
      console.info('更新token', token)
      store.commit('SET_TOKEN', token)
    }
    // console.log(response)
    if (response.status === 200 && response.data) {
      if (response.data.resultCode === '0') {
        return response.data.result
      } else {
        Toast(response.data.resultMsg)
        return Promise.reject(response.data.resultMsg)
      }
    } else {
      Toast(response.status)
      return Promise.reject(response.status)
    }
  }, 
  (error) => {
    console.log('error', error)
    if (Axios.isCancel(error)) {
      // 取消请求的情况下，中断Promise调用链
      return new Promise(() => {})
    } if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('请求超时', error.code, error.message)
      Toast("请求超时")
      return Promise.reject('请求超时')
    } else {
      if (error.response) {
        console.log('error.response', error.response)
        let _headersTokenKey = headersTokenKey.toLowerCase()
        if (error.response.headers[_headersTokenKey]) {
          let token = error.response.headers[_headersTokenKey]
          console.info('更新token', token)
          store.commit('SET_TOKEN', token)
        }
        if (error.response.status === 401) { // token过期
          // 删除token
          store.commit('SET_TOKEN', '')
          // 弹窗
          Dialog.alert({
            message: '正在进行企业微信授权'
          }).then(() => {
            // on close
            window.location.href = reLoginUrl
          })
          return Promise.reject('登录过期')
        } if (error.response.status === 404) {
          Toast('404')
          return Promise.reject('404')
        } else {
          if (error.response.data.resultMsg) {
            Toast(error.response.data.resultMsg)
            return Promise.reject(error.response.data.resultMsg)
          } else {
            if (error.response.data.message == 'Subject does not have role [see_cost_price]') {
              // Toast(error.response.data.message)
              // 无成本价查看权限时不弹窗
              console.log(error.response.data.message)
            } else if (error.response.data.message == 'Subject does not have role [download_protect_atta]') {
              Dialog({message: '无下载权限'})
            } else {
              // Toast(error.response.data.message)
            }
            return Promise.reject(error.response.data.message)
          }
        }
      } else {
        // Toast('网络连接出错')
        return Promise.reject('网络连接出错')
      }
    }
  }
);


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

function get(url,params = {}){
  return new Promise((resolve,reject) => {
    axios.get(url, {
      params: params
    })
    .then(response => {
      resolve(response)
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
    .then(response => {
      resolve(response)
    },err => {
      reject(err)
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function deleteHttp(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.delete(url, { data: data})
    .then(response => {
      resolve(response);
    },err => {
        reject(err)
      })
    })
  }
  
  /**
   * 封装put请求
   * @param url
   * @param data
   * @returns {Promise}
   */
  
  function put(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
    })
  }
  Vue.prototype.$get = get;
  Vue.prototype.$post = post;
  Vue.prototype.$put = put; 
  Vue.prototype.$deleteHttp = deleteHttp;
  Vue.prototype.$http = axios;
  export default axios
  