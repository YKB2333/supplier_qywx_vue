<template>
  <div id="find-page">
    <!-- 供应商库/物料库 -->
    <div class="header-box">
      <van-tabs v-model="storeActive" line-width="28" :border="false" :ellipsis="false" >
        <van-tab :title="supplierTabName" ></van-tab>
        <van-tab title="物料库"></van-tab>
      </van-tabs>
      <div class="right-box pointer" @click="showSearch = true;">
        <img :src="require('@/assets/images/icon_search.png')" width="22" >
        <span class="fs14 " v-if="searchVal">: <span class="decoration">{{ searchVal }}</span> </span>
      </div>
    </div>
    <!-- 供应商 -->
    <div v-show="storeActive === 0">
      <supplier ref="supplier" :Index="radioActive" :search="searchVal"></supplier>
    </div>
    <!-- 物料 -->
    <div v-show="storeActive === 1">
      <warehouse ref="warehouse" :search="searchVal" @goodsList='setGoodsList'></warehouse>
    </div>
    <!-- 搜索弹窗 -->
    <van-popup v-model="showSearch" position="right" :style="{ height: '100%', width: '100%' }" class="search-popup">
      <form action="/">
        <van-search
          v-model="searchVal"
          placeholder="请输入供应商名称/物料名称/主营品牌"
          show-action
          action-text="重置"
          @search="onSearch"
          @cancel="onCancelSearch"
        >
          <img :src="require('@/assets/images/icon_search.png')" width="22" slot="left-icon">
        </van-search>
      </form>
      <!-- 历史搜索 -->
      <div class="search-records" >
        <template v-if="searchHistory.length">
          <div class="histroy">
            <p class="title">历史搜索</p>
            <img :src="require('@/assets/images/icon_delete.png')" width="22" @click="$store.commit('SET_SEARCH_HISTORY', [])" class="pointer">
          </div>
          <div class="list-wrapper">
            <div v-for="(item, index) in searchHistory" :key="index" class="record-item" @click="onSearch(item)">{{ item }}</div>
          </div>
        </template>
        <div class="close-btn" @click="showSearch = false">关闭</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { savePosition } from "@/mixins"
import  supplier  from "./components/Supplier"
import  warehouse  from "./components/Warehouse"
import { mapGetters } from 'vuex'

export default {
  name: "Find",
  components: { supplier,warehouse },
  mixins: [new savePosition('scroll-list')],
  data() {
    return {
      isCache: false,
      showSearch: false,
      searchVal: '',
      storeActive: 0, // 0供应商库，1物料库
      radioActive: 1, // -1-未选中 1-品牌供应商，2-OEM供应商，3-OEM, 4-配件供应商
      sidebarScrollTop: 0,
      supplierScrollTop: 0,
      goodsListScrollTop: 0,
      keepType: '',// 缓存的路由传参的名字
      goodsList: []
    }
  },
  created() {},
  activated() {
    if (this.isCache) {
      return ;
    }
    // 进入传入的名字不是缓存的名字，重新判断
    if(this.keepType != this.$route.query.type || this.$route.query.type == 'search'){
      this.keepType = this.$route.query.type;
      this.initType()
      this.init(this.radioActive); //  供应商接口初始化
      this.$refs.supplier.setScrollTop(0, 0)
      return
    }
    // 进入页面判断进入类型
    if (this.storeActive === 0) {
      // 设置供应商缓存进入坐标
      this.$refs.supplier.setScrollTop(this.sidebarScrollTop, this.supplierScrollTop)
    } else if (this.storeActive === 1) {
      // this.$refs['goods-list'].scrollTop = this.goodsListScrollTop
    }
  },
  computed: {
    // ...mapGetters([
    //   'searchHistory',
    //   'roleList'
    // ]),
    ...mapGetters({
      searchHistory: 'searchHistory',
      roleArr: 'roleList'
    }),
    roleList() {
      return JSON.parse(this.roleArr);
    },
    supplierTabName() {
      let roleArr = this.roleList;
      if (roleArr.includes('visitor_qywx_admin')) {
        return '供应商'
      }
      if (roleArr.includes('visitor_qywx_depart_manager')) {
        return '部门供应商'
      }
      return '我的供应商'
    }
  },
  methods: {
    // 判断入口的类型
    initType(){
      if(this.$route.query.type == 'search'){
        this.radioActive = -1;
        // this.showTab = true
        this.showSearch = !this.showSearch;
      }
      if(!this.$route.query.type){
        this.radioActive = 1;
        // this.showTab = true
      }
      if( this.$route.query.type == 'ODM'){
        this.radioActive = 2;
        // this.showTab = false
      }
      if( this.$route.query.type == 'OEM'){
        this.radioActive = 3;
        // this.showTab = false
      }
      if(this.$route.query.type == 'accessories'){
        this.radioActive = 4;
        // this.showTab = false
      }
    },
    // 供应商数据初始化
    init(data) {
      this.$nextTick(() => {
        this.$refs.supplier.init(data)
      })
    },
    // 获取供应商列表
    fetchSupplierList() {
      this.$nextTick(() => {
        this.$refs.supplier.fetchSupplierList();
      })
    },
    // 获取一级、二分类
    fetchCateData() {
      this.$nextTick(() => {
        this.$refs.supplier.fetchCateData();
      })
    },
    // 搜索
    onSearch(searchValue) {
      let val = searchValue.trim()
      if (!val) return
      this.searchVal = val
      this.$store.commit('SET_SEARCH_HISTORY', val)
      this.showSearch = false
      if (this.storeActive === 0) {
        this.fetchCateData()
        this.fetchSupplierList()
      } else if (this.storeActive === 1) {
        this.resetGoodsQuery()
        this.fetchGoodsList()
      }
    },
    onCancelSearch() {
      this.searchVal = ''
      if (this.storeActive === 0) {
        this.init()
      } else if (this.storeActive === 1) {
        this.resetGoodsQuery()
        this.fetchGoodsList()
      }
      this.showSearch = false
    },
    fetchGoodsList(type) {
      this.$nextTick(() => {
        this.$refs.warehouse.fetchGoodsList(type)
      })
    },
    resetGoodsQuery() {
      this.$nextTick(() => {
        this.$refs.warehouse.resetGoodsQuery()
      })
    },
    setGoodsList(data) {
      this.goodsList = data
    }
  },
  beforeRouteLeave(to, from , next) {
    if (this.isCache) {
      next()
      return ;
    }
    if (this.storeActive === 0) {
      //获取子组件返回的坐标
      [this.sidebarScrollTop,this.supplierScrollTop] = this.$refs.supplier.getScrollTop()
    } else if (this.storeActive === 1) {
      // this.goodsListScrollTop = this.$refs['goods-list'].scrollTop || 0
    }
    next()
  },
  watch: {
    // 切换tab 刷新
    storeActive(val) {
      if (val === 1) { // 物料
        if (this.searchVal) {
          this.searchVal = ''
          this.fetchSupplierList()
        }
        if (!this.goodsList.length) {
          this.fetchGoodsList()
        }
      }
      if (val === 0) {
        if (this.searchVal) this.searchVal = ''
        this.init()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#find-page{
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .header-box{
    padding: 0 14px 0  0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    /deep/ .van-tabs{
      // width: 150px;
      .van-tab--active{
        color: #262626 !important;
        font-weight: 600;
      }
      .van-tab{
        color: #AFAFAF;
        font-size: 14px;
        min-width: 60px;
      }
      .van-tabs__line{
        background-color: #57B4B4;
      }
    }
    .right-box{
      display: flex;
      align-items: center;
    }
  }
}

.search-popup{
  .van-search{
    padding: 10px 0;
    margin: 0 10px;
    border-bottom: 1px solid #262626;
  }
  .van-search__content{
    background-color: transparent;
  }
  /deep/ .van-search__action{
    font-size: 15px;
    color: #262626;
  }
  .search-records{
    padding: 20px 16px;
    .title{
      font-size: 15px;
      color: #262626;
      font-weight: 600;
    }
    .histroy{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .list-wrapper{
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0;
      .record-item{
        background-color: #f6f6f6;
        color: #262626;
        font-size: 14px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        margin-right: 8px;
        margin-bottom: 6px;
        cursor: pointer;
      }
    }
  }
}

/deep/ .van-tab__text{
  display: block;
  text-align: center;
  padding-left:10px;
  padding-right:10px;
}

.close-btn{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #ea3f3f;
  color: white;
  letter-spacing: 2px;
  left: 0;
}

.decoration{
  text-decoration: underline;
  color: blue;
}
</style>
