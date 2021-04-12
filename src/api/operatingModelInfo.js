import axios from '../libs/http'

export function selectPage(data) {
  return axios.post(`/customer/operatingModelInfo/selectPage`, data)
}

export function getOne(id) {
  return axios.get(`/customer/operatingModelInfo/getOne/${id}`)
}

export function attaList(id, type) {
  return axios.get(`/customer/operatingModelAtta/${id}/${type}`)
}