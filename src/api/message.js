import axios from '../libs/http'
import { apiAgent,clientApiAgent } from '../config'

export function noticePage(data) {
  return axios.post(`/supplier/msg/noticePage`, data)
}

export function noticeRead(id) {
  return axios.put(`/supplier/msg/noticeRead/${id}`)
}

// export function myMsgCount() {
//   return axios.get(`/supplier/msg/myMsgCount?agent=${apiAgent}`)
// }
export function myMsgCount(data) {
  return axios.post(`/supplier/msg/myMsgCount`,data)
}

export function myMsgPage(data) {
  return axios.post(`/supplier/msg/myMsgPage`, data)
}

export function recMsgPage(data) {
  return axios.post(`/supplier/msg/recMsgPage`, data)
}

export function msgAdd(data) {
  return axios.post(`/supplier/msg/msgAdd`, data)
}

export function msgDetail(msgId) {
  return axios.get(`/supplier/msg/msgDetail/${msgId}?agent=${apiAgent}`)
}
export function wxMsgDetail(msgId) {
  return axios.get(`/supplier/msg/msgDetail/${msgId}?agent=${clientApiAgent}`)
}


export function replyList(msgId) {
  return axios.get(`/supplier/msg/replyList/${msgId}`)
}

export function replyAdd(data) {
  return axios.post(`/supplier/msg/replyAdd`, data)
}

export function msgDelete(msgId) {
  return axios.delete(`/supplier/msg/msgDelete/${msgId}`)
}

export function replyDelete(replyId) {
  return axios.delete(`/supplier/msg/replyDelete/${replyId}`)
}
export function noticeCount(data) { //根据条件获取通知总数
  return axios.put(`/supplier/msg/noticeCount`,data)
}
export function purchaseNoticeCount(data) { //根据条件获取采购需求通知总数
  return axios.put(`/supplier/msg/purchaseNoticeCount`,data)
}
export function wxMiniAppNoticeCount(data) { //小程序通知总数
  return axios.put(`/supplier/msg/wxMiniAppNoticeCount`,data)
}
export function wxMiniAppNoticePage(data) { //小程序通知列表
  return axios.post(`/supplier/msg/wxMiniAppNoticePage`,data)
}
