export default [
  {
    path: '/search-supplier',
    name: 'SearchSupplier',
    component: () => import('@/views/search-supplier'),
    meta: {
      title: '搜索',
      needCachePages: [
        'DetailsMessage',
        'productDetails'
      ]
    }
  }
]
