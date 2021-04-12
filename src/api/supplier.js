import axios from '@/libs/http'

// 获取对应供应商类型对数量
export const getSupTypeCount = (type, productType = '') => axios.get(`/supplier/count?type=${type}&productType=${productType}`)

// 获取推荐物料数量
export const getRecommendProductCount = (proType) => axios.post(`/supplier/countRecommendProduct`, { proType: proType, checkedStatus: '2' })

export function getSupTypes() { // 供应商分类列表
  return axios.get(`/supplier/getSupTypes`)
}

export function getSupCateList(data) { // 供应商分类列表
  return axios.post(`/supplier/categoryList`, data)
}

export function getSupDetail(supId) { // 获取供应商详情
  return axios.get(`/supplier/detail/${supId}`)
}

export function searchSupList(data) {
  return axios.post(`/supplier/searchList`, data)
}

export function selectRecommendProductPage(data) { // 推荐商品列表（物料库）
  return axios.post(`/supplier/selectRecommendProductPage`, data)
}

export function getGoodsDetail(id) {
  return axios.get(`/supplier/getRecommendProductById/${id}`)
}

export function getCoopSuppliers() {
  return axios.get(`/supplier/getCoopSuppliers`)
}
export function searchInfoPage(data) { // 分页查询资讯
  return axios.post(`/supplier/supCmsInfo/selectCmsInfoPage`,data)
}
export function searchPage(data, cancelToken) { //供应商列表
  return axios.post(`/supplier/searchPage`, data, { cancelToken })
}
export function uploadSupplierAtta(data) { //供应商附件上传
  return axios.post(`/uploadSupplierAtta`,data)
}
export function searchRecommendProduct(data, cancelToken) { // 推荐商品列表（物料库）
  return axios.post(`/supplier/searchRecommendProduct`, data, { cancelToken })
}
export function recommendProductCategoryList(data) { // 推荐商品分类列表（物料库）
  return axios.post(`/supplier/recommendProductCategoryList`, data)
}
export function getCoopGoodsDetail(data) { // 推荐商品分类列表（物料库）
  return axios.get(`/supplier/getCoopGoodsBy/${data.supId}/${data.spuId}`)  
}
export function supDetailAuth() { // 是否具有查看供应商明细权限
  return axios.get(`/supplier/detail/authentication`)  
}
export function enableSend() { // 供应商中心企微端-是否有短资讯发送权限
  return axios.get(`/supplier/supCmsInfo/enableSend`)  
}
export function addPostInfo(data) { // 供应商中心企微端-添加短资讯信息
  return axios.post(`/supplier/supCmsInfo/addInfo`, data)  
}
export function getAllTag() { // 供应商中心企微端-获取所有短资讯标签
  return axios.post(`/supplier/supCmsInfo/selectTag`)  
}
export function saveTag(data) { // 供应商中心企微端-新增短资讯标签
  return axios.post(`/supplier/supCmsInfo/saveTag`, data)  
}
export function deleteTag(id) { // 供应商中心企微端-删除短资讯标签
  return axios.post(`/supplier/supCmsInfo/deleteTag/${id}`)  
}
export function delInfo(id) { // 供应商中心企微端-删除短资讯信息
  return axios.delete(`/supplier/supCmsInfo/delInfo/${id}`)  
}


