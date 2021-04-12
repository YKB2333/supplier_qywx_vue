
const apiAgent = 'supplier'
const baseURL = 'http://sptest.yanmiya.com:8084/wx'

module.exports = {
  baseURL,
  apiAgent,
  // token过期后重新跳转的地址
  reLoginUrl: `${baseURL}/login/agent=${apiAgent}`,
  // 是否显示console按钮
  vconsole: true,
  // 后门token
  testToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoiQ29tcHV0ZXIiLCJjdXJyZW50VGltZU1pbGxpcyI6IjE2MDM2MDExMzQ4ODEiLCJpc0FkbWluIjoiZmFsc2UiLCJleHAiOjE2MDM2MDcxMzQsImFjY291bnQiOiIzNTYxMjc5MDE1MTEwNjU2MDAifQ.dhwagzm8qmsP3asye5dpjZO3RaX8IkjvGEls57zO2J8',
  cmsCategoryId: {
    purchaseBusinessTools: 77, //我的-采购业务工具
    purchaseTrainCourse: 78, //我的-采购培训课程
    banner: 68, //首页-轮播
    lastMonthCoreSup: 69, //首页-上月新增核心供应商
    onePkg: 70, //首页-一件代发
    newsInfo: 72, //首页-最新资讯
    custCase: 71, //首页-经典案例分享
    purchaser: 73, //首页-采购荣誉榜
    process: 79, // 我的-流程
    recommend: 98, // 供应商新品推荐
    newProduct: 99, //供应商新增商品
    information: 100, //行业资源共享
    vendorBrand: 102, // 品牌供应商
    JPBrand: 155, // 日本供应商
  },
  otherAppLogin: {
    customer: `http://sptest.yanmiya.com:8084/wx/login?agent=customer`,
    goods: `http://sptest.yanmiya.com:8084/wx/login?agent=goods`
  },
  baiduSiteId: '2886c135a415f6f94c50152cca7d0c74'
}
