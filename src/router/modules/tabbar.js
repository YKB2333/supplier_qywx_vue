export default [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/tabbar/Home'),
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/tabbar/Message'),
    meta: {
      title: '消息'
    }
  },
  {
    path: '/find',
    name: 'Find',
    // component: () => import('@/views/tabbar/Find'),
    component: () => import('@/views/tabbar/find-firm'),
    meta: {
      title: '发现厂商',
      keepAlive: true,
      needCachePages: [
        'DetailsMessage',
        'productDetails'
      ]
    }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/tabbar/Mine'),
    meta: {
      title: '我的'
    }
  }
]
