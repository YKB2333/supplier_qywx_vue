import axios from '../libs/http'

export function getEcologyUserByWorkCode(workCode) {
  return axios.get(`/ecology-user/getEcologyUserByWorkCode/${workCode}`)
}

export function uploadSupInfoImage(data) { //供应商中心-供应商短资讯图片上传
  let formData = new FormData()
  formData.append('file', data)
  return axios.post(`/uploadSupInfoImage`, formData)
}

export function uploadSupInfoVideo(data) { //供应商企微端-供应商短资讯视频上传
  let formData = new FormData()
  formData.append('file', data)
  return axios.post(`/uploadSupInfoVideo`, formData)
}

