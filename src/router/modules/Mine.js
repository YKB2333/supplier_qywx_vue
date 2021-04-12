export default [
  {
    path: '/growthBook',
    name: 'GrowthBook',
    component: () => import('@/views/mine/GrowthBook'),
    meta: {
      title: '成长手册',
      needCachePages: ['NewsDetails', 'PurchaseCourseList']
    }
  },
  {
    path: '/processDetail',
    name: 'ProcessDetail',
    component: () => import('@/views/mine/ProcessDetail'),
    meta: {
      title: '流程'
    }
  },
  {
    path: '/collectList',
    name: 'CollectList',
    component: () => import('@/views/mine/CollectList'),
    meta: {
      title: '收藏列表',
      needCachePages: ['NewsDetails']
    }
  },
  {
    path: '/purchaseCourseList',
    name: 'PurchaseCourseList',
    component: () => import('@/views/mine/PurchaseCourseList'),
    meta: {
      title: '采购培训课程',
      needCachePages: ['NewsDetails']
    }
  },
  {
    path: '/version',
    name: 'Version',
    component: () => import('@/views/mine/version'),
    meta: {
      title: '版本更新'
    }
  }
]
