
const apiAgent = 'supplier'
const baseURL = 'http://goods.yanmiya.com/wx'

module.exports = {
  baseURL,
  apiAgent,
  // token过期后重新跳转的地址
  reLoginUrl: `${baseURL}/login/agent=${apiAgent}`,
  // 是否显示console按钮
  vconsole: false,
  // 后门token
  testToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VUeXBlIjoiQ29tcHV0ZXIiLCJjdXJyZW50VGltZU1pbGxpcyI6IjE2MDM2MDExMzQ4ODEiLCJpc0FkbWluIjoiZmFsc2UiLCJleHAiOjE2MDM2MDcxMzQsImFjY291bnQiOiIzNTYxMjc5MDE1MTEwNjU2MDAifQ.dhwagzm8qmsP3asye5dpjZO3RaX8IkjvGEls57zO2J8',
  cmsCategoryId: {
    purchaseBusinessTools: 63, //我的-采购业务工具
    purchaseTrainCourse: 64, //我的-采购培训课程
    banner: 53, //首页-轮播
    lastMonthCoreSup: 54, //首页-上月新增核心供应商
    onePkg: 55, //首页-一件代发
    newsInfo: 57, //首页-最新资讯
    custCase: 56, //首页-经典案例分享
    purchaser: 58, //首页-采购荣誉榜
    process: 62, // 我的-流程
    recommend: 91, // 供应商新品推荐
    newProduct: 92, //供应商新增商品
    information: 90, //行业资源共享
    vendorBrand: 89, // 品牌供应商
    JPBrand: 137, // 日本供应商
  },
  otherAppLogin: {
    customer: `http://goods.yanmiya.com/wx/login?agent=customer`,
    goods: `http://goods.yanmiya.com/wx/login?agent=goods`
  },
  baiduSiteId: 'ebe074eefc13b27b098d06c92073f49f'
}

