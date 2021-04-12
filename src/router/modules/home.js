export default [
  {
    path: '/custCases',
    name: 'CustCases',
    component: () => import('@/views/Home/CustCases'),
    meta: {
      title: '经典案例分享',
      needCachePages: [
        'NewsDetails'
      ]
    }
  },
  {
    path: '/latestnews',
    name: 'LatestNews',
    component: () => import('@/views/Home/LatestNews'),
    meta: {
      title: '最新资讯',
      needCachePages: [
        'NewsDetails',
        'productDetails'
      ]
    }
  },
  {
    path: '/newsdetails',
    name: 'NewsDetails',
    component: () => import('@/views/Home/NewsDetails'),
    meta: {
      title: '资讯详情'
    }
  },
  {
    path: '/JapanNewsDetails',
    name: 'JapanNewsDetails',
    component: () => import('@/views/Home/JapanNewsDetails'),
    meta: {
      title: '资讯详情'
    }
  },
  {
    path: '/shareDetails',
    name: 'ShareDetails',
    component: () => import('@/views/Home/ShareDetails'),
    meta: {
      title: '行业资源共享详情'
    }
  },
  {
    path: '/shareList',
    name: 'ShareList',
    component: () => import('@/views/Home/ShareList'),
    meta: {
      title: '行业资源共享'
    }
  },
  {
    path: '/purchaser',
    name: 'Purchaser',
    component: () => import('@/views/Home/Purchaser'),
    meta: {
      title: "金牌采购介绍"
    }
  },
  {
    path: '/onegeneration',
    name: 'OneGeneration',
    component: () => import('@/views/Home/oneGeneration'),
    meta: {
      title: '一件代发',
      needCachePages: ['OneGenerationDetails']
    }
  },
  {
    path: '/oneGenerationDetails',
    name: 'OneGenerationDetails',
    component: () => import('@/views/Home/oneGenerationDetails'),
    meta: {
      title: '一件代发案例'
    }
  },
]