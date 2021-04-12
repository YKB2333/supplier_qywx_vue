import axios from '@/libs/http'

export function getSupTypes() { // 供应商分类列表
  return axios.get(`/supplier/getSupTypes`)
}
