import axios from '../libs/http'
import { apiAgent } from '../config'

// export function favoriteCount(data) { // 获取当前平台下，我的收藏数
//   return axios.post(`/supplier/favorite/count`,data)
// }
export function favoriteCount() { // 获取当前平台下，我的收藏数
  return axios.post(`/supplier/favorite/count`, {
    sysTag: apiAgent,
    pageIndex: 1,
    pageSize: 1,
  })
}

export function favoritePage(data) { // 获取当前平台下，我的收藏分页
  return axios.post(`/supplier/favorite/page`,data)
}

export function likeCount() { // 获取当前平台下，我的点赞数
  return axios.get(`/supplier/like/count?agent=${apiAgent}`)
}

export function getInfoList(data) { // 获取资讯列表
  return axios.post(`/supplier/info/selectPage?agent=${apiAgent}`, data)
}

export function getOne(id) {
  return axios.get(`/supplier/info/getOne/${id}?agent=${apiAgent}`)
}

export function addCollect(data) { // 添加收藏
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/supplier/info/favorite`, params)
}

export function cancelCollect(infoId) { // 取消收藏
  return axios.put(`/supplier/info/favorite/cancel/${infoId}?agent=${apiAgent}`)
}

export function addLike(data) { // 添加点赞
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/supplier/info/like`, params)
}

export function cancelLike(infoId) { // 取消点赞
  return axios.put(`/supplier/info/like/cancel/${infoId}?agent=${apiAgent}`)
}

export function getCollectList(data) { // 获取收藏列表
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/supplier/favorite/page`, params)
}