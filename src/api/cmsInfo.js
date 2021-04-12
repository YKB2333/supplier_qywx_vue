import axios from '../libs/http'
import { apiAgent } from '@/config'

export function getListBySupplierId(supplierId) { // 通过供应商id获取该供应商的资讯
  return axios.post(`/supplier/selectCmsInfoList`, {supplierId, orderStr: 'createTimestamp desc'})
}

export function selectPage(data) {
  return axios.post(`/cms/info/selectPage`, data)
}

export function getOne(id) { // 获取资讯详情
  return axios.get(`/supplier/info/getOne/${id}?agent=${apiAgent}`)
}
export function getJapanInfoOne(id) { // 获取日本资讯详情
  return axios.get(`/supplier/supCmsInfo/getOne/${id}?agent=${apiAgent}`)
}

export function getAttaById(id) {
  return axios.get(`/cms/attachment/getByInfoId/${id}`)
}
