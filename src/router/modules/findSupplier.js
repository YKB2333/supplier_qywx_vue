export default [
    {
      path: '/supplierdetails',
      name: 'SupplierDetails',
      component: () => import('@/views/FindSupplier/SupplierDetails'),
      meta: {
        title: '供应商明细'
      }
    },
    {
      path: '/materialdetails',
      name: 'MaterialDetails',
      component: () => import('@/views/FindSupplier/MaterialDetails'),
      meta: {
        title: '物料库详情'
      }
    },
    {
      path: '/brandsupplier',
      name: 'BrandSupplier',
      component: () => import('@/views/FindSupplier/BrandSupplier'),
      meta: {
        title: '品牌供应商',
        needCachePages: [
          'DetailsMessage',
          'NewsDetails'
        ]
      },
    },
    {
      path: '/detailsmessage',
      name: 'DetailsMessage',
      component: () => import('@/views/FindSupplier/DetailsMessage'),
      meta: {
        title: '供应商详情',
        needCachePages: [
          'attrDetailist',
        ]
      }
    },
    {
      path: '/infoDetailList',
      name: 'InfoDetailList',
      component: () => import('@/views/FindSupplier/InfoDetailList'),
      meta: {
        title: '供应商资讯列表',
        needCachePages: [
          'detailsmessage',
        ]
      }
    },
    {
      path: '/attrdetailist',
      name: 'attrDetailist',
      component: () => import('@/views/FindSupplier/attrDetailist'),
      meta: {
        title: '合作产品'
      }
    },
    
    { 
      path: '/saletools',
      name: 'SaleTools',
      component: () => import('@/views/FindSupplier/SaleTools'),
      meta: {
        title: '行业资源共享'
      }
    },
    { 
      path: '/product/details/index',
      name: 'productDetails',
      component: () => import('@/views/FindSupplier/product-details/index'),
      meta: {
        title: ''
      }
    },
    {
      path: '/sourcesupplier',
      name:'SourceSupplier',
      component: () => import('@/views/FindSupplier/source-supplier'),
      meta: {
        title: '品牌供应商',
        needCachePages: [
          'DetailsMessage',
          'JapanNewsDetails'
        ]
      },
    },
    { 
      path: '/post/page/index',
      name: 'PostPage',
      component: () => import('@/views/FindSupplier/post-page/index'),
      meta: {
        title: '发帖'
      }
    }
  ]