import axios from '../libs/http'
import { apiAgent } from '../config'

export function wxSignature(url) { // 微信签名
  return axios.get(`/createJsapiSignature?agent=${apiAgent}&url=${url}`)
}

export function currentUser() { // 获取微信用户
  return axios.get(`/user/getCurrentUser?agent=${apiAgent}`)
}

export function currentUserByUserId(userId) { // 获取微信用户
  return axios.get(`/user/getCurrentUserByUserId?agent=${apiAgent}&userId=${userId}`)
}


export function deptById(deptId) { // 获取微信用户的部门
  return axios.get(`/dept/getDeptById?agent=${apiAgent}&deptId=${deptId}`)
}

export function getSupInfoByUserId(userId) { // 通过userId获取绑定的供应商信息
  return axios.get(`/supplier/getSupInfoByUserId?userId=${userId}`)
}

export function getCurrentUser() { // 当前用户
  return axios.get(`/user/getCurrentUser?agent=${apiAgent}`)
}


