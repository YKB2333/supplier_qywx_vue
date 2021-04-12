<template>
  <section>
    <!-- tab供应商分类 -->
    <div class="plr16 ptb18">
      <radio-group :class="storeActive === 0 ? 'radio-group-rc' : ''"
        :list="groupList"
        v-model="radioActive"
        @change="onRadioChange"
        full
      />
    </div>
    <!-- 底部分类 -->
    <div id="content-wrapper">
      <!-- 侧边栏 -->
      <div id="sidebar" ref="sidebar-box">
        <div class="item" 
          v-for="(item, index) in sidebarData" :key="index" 
          :class="{'active': index === sidebarActive}"
          @click="onSidebarClick(item, index)"
        >
          <p>{{ item.name }}</p>
          <i class="line"></i>
        </div>
      </div>
      
      <div class="right-box">
        <!-- 侧边栏目tab -->
        <van-tabs 
          v-if="tabsData.length"
          v-model="tabsActive" 
          :ellipsis="false" 
          :border="false" 
          class="van-hairline--bottom" 
          :class="tabsActive === -1 ? 'on-search' : ''" 
          title-active-color="#57B4B4" title-inactive-color="#afafaf"
          @click="onTabsChange"
        >
          <van-tab 
            v-for="(item, index) in tabsData" :key="index"
            :title="item.name"
          />
        </van-tabs>
        <!-- 商品信息 -->
        <div id="scroll-content" ref="supplier-box">
          <div>
            <p class="cate-title" v-if="searchVal || curTab">
              <span v-if="searchVal">一 搜索结果 一</span>
            </p>
            <van-row gutter="10" class="plr10 mlr0" type="flex" justify="start" align="top">
              <van-col span="8" class="cate-item" v-for="(item, index) in supplierList" :key="index" @click="onClickPage(item.id)">
                <div class="icon-wrapper van-hairline--surround relative">
                  <img class="tag" v-if="item.checkedStatus == '1' && !item.code" :src="require('@/assets/images/icon_temp_supplier.png')" />
                  <img :src="item.logo || require('@/assets/images/logo.png')" class="sup-img">
                </div>
                <p class="ellipsis name">{{ item.name }}</p>
              </van-col>
            </van-row>
          </div>
          <div class="text-center pt30">
            <van-loading v-if="loading" size="24px">加载中...</van-loading>
            <p v-if="nullData && !loading" class="fs14">暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { searchSupList, getSupCateList } from '@/api/supplier'
import RadioGroup from "@/components/RadioGroup"

export default {
  components: { RadioGroup },
  data() {
    return {
      storeActive: 0, // 0供应商库，1物料库
      groupList: [
        { text: '品牌供应商', value: 1},
        { text: 'ODM供应商', value: 2},
        { text: 'OEM供应商', value: 3 },
        { text: '配件供应商', value: 4 }
      ],//进入的odm 判断值
      radioActive: 1, // -1-未选中 1-品牌供应商，2-OEM供应商，3-OEM, 4-配件供应商
      sidebarActive: 0, // 一级分类
      tabsActive: 0, // 二级分类
      searchVal: '',
       // 分类查询条件
      cateQuery: {
        keyword: '',
        pageIndex: 1,
        pageSize: this.$maxNumber,
        orderType: 1,
        orderProperty: 'orderLevel',
      },
      supplierQuery: {
        pageIndex: 1,
        pageSize: this.$maxNumber,
        keyword: '',
        orderType: 1,
        orderProperty: 'orderLevel',
      },
       // 一级分类
      sidebarData: [],
      // 二级分类
      TwoCategory: [],
      preTabsData: [],
      loading: false,
       // 供应商列表
      supplierList: [],
      nullData: false,

    }
  },
  watch: {
    'Index': {
      deep: true,
      handler (newVal, oldVal) {
        this.radioActive = newVal
      }
    },
    'search': {
      deep: true,
      handler (newVal, oldVal) {
        this.searchVal = newVal
        console.log(this.searchVal,'no1');
      }
    },
  },
  props:{
    Index:{ // -1-未选中 1-品牌供应商，2-OEM供应商，3-OEM, 4-配件供应商
      type: Number,
      default: 1
    },
    //搜索
    search:{
      type:String,
      default:''
    },
  },
  computed: {
    // 当前显示二级分类
    tabsData() {
      console.log(this.sidebarData,'sidebarActivesidebarActive');
      console.log(this.sidebarActive,'sidebarActive');
      console.log(this.TwoCategory,'TwoCategory');
      let curOne = this.sidebarData[this.sidebarActive]
      let arr = this.TwoCategory.filter(item => item.superId === curOne.id)
      // arr.unshift({name:'全部',id:0})
      return arr
    },
    curTab() {
      return this.tabsData[this.tabsActive]
    }
  },
  created() {
  },
  methods: {
    onClickPage(id){
      this.$router.push({path:'/detailsmessage',query: {id: id}})
    },
    onRadioChange(val) {
      // console.log(this.radioActive === 1 ? '成品' : this.radioActive === 2 ? '配件' : '')
      this.$refs['supplier-box'].scrollTop = 0
      this.sidebarActive = 0
      this.tabsActive = 0
      this.init()
    },
    initType(){
      if(this.radioActive == 1) {
        this.supplierQuery.goodsServiceType = [1,3,4]
        this.cateQuery.goodsServiceType = [1,3,4]
      }else if(this.radioActive == 2) {
        this.supplierQuery.goodsServiceType = [2]
        this.cateQuery.goodsServiceType = [2]
      }else if(this.radioActive == 3) {
        this.supplierQuery.goodsServiceType = [5]
        this.cateQuery.goodsServiceType = [5]
      }else{
        this.supplierQuery.goodsServiceType = []
        this.cateQuery.goodsServiceType = []
      }
    },
    async init(index) {
      this.groupList=[{ text: '品牌供应商', value: 1},{ text: 'ODM供应商', value: 2},{ text: 'OEM供应商', value: 3 },{ text: '配件供应商', value: 4 }]
      if(index == 2 ){
        this.groupList = [{ text: 'ODM供应商', value: 2}]
      }
      if(index ==3){
         this.groupList = [{ text: 'OEM供应商', value: 3 }]
      }
      if(index == 4){
          this.groupList = [{ text: '配件供应商', value: 4 }]
      }

      if(index) this.radioActive = index;
      this.initType()
      await this.fetchCateData()
      this.fetchSupplierList()
    },
    // 获取一级、二分类
    fetchCateData() {
      return new Promise((resolve, reject) => {
        let params = _.cloneDeep(this.cateQuery)
        if(this.radioActive == -1) params['type'] = '1'
        if(this.radioActive == 1) params['type'] = '1'
        if(this.radioActive == 2) params['type'] = '1'
        if(this.radioActive == 3) params['type'] = '1'
        if(this.radioActive == 4) params['type'] = '2'
        params['keyword'] = this.searchVal
        getSupCateList(params).then(res => {
          // console.log('分类数据', res)
          if (this.radioActive == 4) {
            this.sidebarData = res.partsOneCategory
            this.TwoCategory = res.partsTwoCategory
          } else if (this.radioActive == -1 || this.radioActive == 1 || this.radioActive == 2 || this.radioActive == 3) {
            this.sidebarData = res.productOneCategory
            this.TwoCategory = res.productTwoCategory
          }
          console.log('一级分类', this.sidebarData)
          console.log('二级分类', this.TwoCategory)

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取供应商列表
    fetchSupplierList() {
      let params = _.cloneDeep(this.supplierQuery)
      if(this.radioActive == -1) {
        params['type'] = '1'
      }
      if(this.radioActive == 1) {
        params['type'] = '1'
      }
      if(this.radioActive == 2) {
        params['type'] = '1'
        
      }
      if(this.radioActive == 3) {
        params['type'] = '1'
       
      }
      if(this.radioActive == 4){
         params['type'] = '2'
       
      }
      console.log(this.radioActive)
      params['keyword'] = this.searchVal
      let oneKey = '', twoKey = ''
      if (this.radioActive == 4) {
        oneKey = 'partsOneCode'
        twoKey = 'partsTwoCode'
      }
      if (this.radioActive == -1 || this.radioActive == 1 || this.radioActive == 2 || this.radioActive == 3) {
        oneKey = 'productOneCode'
        twoKey = 'productTwoCode'
      }
      if (!params['keyword'] && this.curTab) {
        params[twoKey] = this.curTab.code
      }
      //如果没有一级，获取二级
      if(this.tabsData.length === 0 && this.sidebarData.length != 0){
        params[oneKey] = this.sidebarData[this.sidebarActive].code
      }
      console.log("==============")
      console.log(this.curTab,'code');
      console.log(params,'params');
      this.loading = true
      return searchSupList(params).then(res => {
        this.supplierList = res
        // console.log('供应商列表', this.supplierList)
        this.nullData = this.supplierList.length === 0 ? true : false
      }).catch(error => {
      }).finally(() => {
        this.loading = false
      })
    },
    onSidebarClick(item, index) {
      if (index === this.sidebarActive) return
      this.$refs['supplier-box'].scrollTop = 0
      this.sidebarActive = index
      // if (this.searchVal) this.searchVal = ''
      this.tabsActive = 0
      this.fetchSupplierList()
    },
    onTabsChange() {
      this.$refs['supplier-box'].scrollTop = 0
      this.supplierList = []
      this.fetchSupplierList()
    },
    getScrollTop(){
      let sidebarScrollTop = this.$refs['sidebar-box'].scrollTop || 0
      let supplierScrollTop = this.$refs['supplier-box'].scrollTop || 0
      return [ sidebarScrollTop,supplierScrollTop]
    },
    setScrollTop(sidebar,supplier){ 
      this.$refs['sidebar-box'].scrollTop = sidebar
      this.$refs['supplier-box'].scrollTop = supplier
    }
    
  },
}
</script>

<style lang="scss" scoped>
 /deep/ .radio-group-rc {
  .radio-btn {
    min-width: 85px !important;
    position: relative;
    background: #F6F6F6 !important;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0,-50%);
      height: 50%;
      width: 1px;
      background: #EEEEEE;
    }
  }
  .active {
    border: none;
    background: #57B4B4 !important;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0,-50%);
      height: 50%;
      width: 1px;
      background: transparent;
    }
  }
}

#content-wrapper{
  flex: 1;
  overflow-y: auto;
  display: flex;
  height: calc(100vh - 120px);
  #sidebar{
    height: 100%;
    overflow-y: auto;
    // flex: 0 0 100px;
    width: 100px;
    display: flex;
    flex-direction: column;
    background-color: #F9F9F9;
    .item{
      min-height: 44px;
      padding: 12px 8px;
      color: #262626;
      font-size: 14px;
      position: relative;
      text-align: center;
      background-color: #F9F9F9;
      cursor: pointer;
      &.active{
        font-weight: 600;
        background-color: #ffffff;
        .line{
          display: inline-block;
          width: 3px;
          height: 20px;
          background-color: #57B4B4;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        .arrow{
          visibility: visible;
        }
      }
    }
  }
  .right-box{
    display: flex;
    flex-direction: column;
    width: calc(100% - 100px);
    /deep/ .van-tabs__line{
      background-color: transparent;
    }
    /deep/ .van-tab{
      padding-left: 10px;
      padding-right: 10px;
    }
    /deep/ .van-tabs.on-search{
      /deep/ .van-tab--active{
        color: #AFAFAF !important;
      }
    }
    #scroll-content{
      flex: 1;
      overflow-y: auto;
      padding-top: 18px;
    }
    .cate-title{
      color: #262626;
      font-size: 14px;
      text-align: center;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .cate-item{
      margin-bottom: 14px;
      cursor: pointer;
      .icon-wrapper{
        width: 75px;
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        .sup-img{
          max-width: 90%;
          height: 100%;
          object-fit: contain;
        }
      }
      .name{
        color: #333;
        font-size: 11px;
        text-align: center;
        margin-top: 8px;
      }
    }
  }
}
.tag{
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
}
/deep/ .van-row--flex{
  flex-wrap: wrap;
}
</style>
