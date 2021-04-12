export default [
  {
    path: '/messageIndex',
    name: 'MessageIndex',
    component: () => import('@/views/tabbar/Message'),
    meta: {
      title: '消息',
      keepAlive: false
    }
  },
  {
    path: '/mymessage',
    name: 'MyMessage',
    component: () => import('@/views/message/MyMessage'),
    meta: {
      title: '我的消息',
      needCachePages: ['NewMessage', 'MessageDetail']
    }
  },
  {
    path: '/newmessage',
    name: 'NewMessage',
    component: () => import('@/views/message/NewMessage'),
    meta: {
      title: '发起留言',
      keepAlive: false
    }
  },
  {
    path: '/messageDetail',
    name: 'MessageDetail',
    component: () => import('@/views/message/PurchaseDetails'),
    meta: {
      title: '留言明细',
      keepAlive: false
    }
  },
  {
    path: '/messageList',
    name: 'MessageDetail',
    component: () => import('@/views/message/MessageDetail'),
    meta: {
      title: '集团消息',
      keepAlive: false
    }
  },
  {
    path: '/groupnewslist',
    name: 'GroupNewsList',
    component: () => import('@/views/message/GroupNewsList'),
    meta: {
      title: '集团消息',
      keepAlive: false
    }
  },
  {
    path: '/suppliernewslist',
    name: 'SupplierNewsList',
    component: () => import('@/views/message/SupplierNewsList'),
    meta: {
      title: '供应商消息',
      keepAlive: false
    }
  },
  {
    path: '/purchasedetails',
    name: 'PurchaseDetails',
    component: () => import('@/views/message/PurchaseDetails'),
    meta: {
      title: '',
      keepAlive: false
    }
  },
  {
    path: '/purchasemessage',
    name: 'PurchaseMessage',
    component: () => import('@/views/message/PurchaseMessage'),
    meta: {
      title: '采购需求',
      keepAlive: true,
      needCachePages: ['NewMessage', 'PurchaseDetails']
    }
  },
]
