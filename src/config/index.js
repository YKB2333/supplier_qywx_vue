
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  projectName: '供应商中心',
  // 项目唯一标识，用于本地数据存储时添加键前缀
  projectKey: 'supplier_',
  clientApiAgent: 'supplier_client',
  // 请求头部里携带的token字段名
  headersTokenKey: 'Authorization',
  // http请求超时
  timeout: 60 * 1000,
  weixin: {
    // 微信调试模式
    debug: false, 
    // 微信需要使用的JS接口列表
    jsApiList: ['previewImage', 'previewFile','openEnterpriseChat', 'onHistoryBack', 'closeWindow', 'selectEnterpriseContact', 'onMenuShareAppMessage', 'hideMenuItems', 'showOptionMenu', 'hideOptionMenu'],
  },
  serviceMan: [
    {
      value: '陈国燕',
      label: 'qy01ffadd1a4f2e0079be381623f'
    }
  ]
}