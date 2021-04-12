<template>
  <section class="find-page">
    <!-- 头部tab-->
    <div class="plr16 ptb18">
      <radio-group 
        :list="proTypeList"
        v-model="goodsType"
        @change="onGoodsTypeChange"
        full
      />
    </div>
    <!-- 商品列表 -->
    <div id="content-wrapper" ref="supplier-box">
      <!-- 侧边栏左 -->
      <div id="sidebar" ref="sidebar-box" v-if="showClassification ">
        <div class="item" 
          v-for="(item, index) in sidebarData" :key="index" 
          :class="{'active': index === sidebarActive}"
          @click="onSidebarClick(item, index)"
        >
          <p>{{ item.name }}</p>
          <i class="line"></i>
        </div>
      </div>
      <!-- 内容右 -->
      <div :class="['right-box',{'w-full':!showClassification } ]" >
        <!-- 侧边横栏目tab -->
        <van-tabs 
          v-if="showClassification && tabsData.length"
          v-model="tabsActive" 
          :ellipsis="false" 
          :border="false" 
          class="van-hairline--bottom" 
          :class="tabsActive === -1 ? 'on-search' : ''" 
          title-active-color="#57B4B4" title-inactive-color="#afafaf"
          @click="onTabsChange">
            <van-tab 
              v-for="(item, index) in tabsData" :key="index"
              :title="item.name"
            />
        </van-tabs>
        <!-- 商品 -->
        <div class="flex-1 plr14 pt10 pb30" style="overflow-y: auto; overflow-x: hidden; background-color: #F9F9F9;" ref="goods-list">
          <van-list
            v-model="vanList.loading"
            :immediate-check="false"
            :finished="vanList.finished"
            :error.sync="vanList.error"
            :finished-text="vanList.finishedText"
            error-text="请求失败，点击重新加载"
            @load="onLoadMore">
            <van-row gutter="10">
              <van-col span="12" v-for="(item, index) in goodsList" :key="index">
                <div class="white-bg p18 mb10 pointer text-center" @click="$router.push({ name: 'productDetails', query: { id: item.id } })">
                  <img :src="item.titleImage || require('@/assets/images/logo.png')" style="width: 105px; height: 105px;    object-fit: contain;">
                  <p class="ellipsis mt14 fs13 text-center" style="color: #262626;">{{ item.name }}</p>
                </div>
              </van-col>
            </van-row>
            <div v-if="vanList.finished && list.length === 0" class="text-center mt100">
              <img :src="require('@/assets/images/supplier_empty.png')" width="50%" />
            </div>
          </van-list>
        </div>
      </div>
    </div>
 
  </section>
</template>

<script>
import RadioGroup from "@/components/RadioGroup"
import { recommendProductCategoryList,searchRecommendProduct } from '@/api/supplier'

export default {
  name: 'Warehouse',
  components: {RadioGroup  },
  data() {
    return {
      vanList: {
        loading: false,
        finished: false,
        finishedText: '',
        error: false,
        myError: false,
        inited: false,
      },
      // 物料库：产品类型
      goodsList: [],
      goodsType: 1, // 成品、包材、原料、其他
      proTypeList: [
        { text: '成品', value: 1 },
        { text: '配件', value: 2 },
        { text: '原料', value: 3 },
        { text: '其他', value: 0 }
      ],
      // 物料库查询
      goodsQuery: {
        pageIndex: 1,
        pageSize: 20,
        proType: '',
        keyword: '',
        checkedStatus: '2',
      },
      // 物料库：产品类型
      goodsList: [],
      vanList: {
        loading: false,
        finished: false,
        finishedText: '',
        error: false,
        myError: false,
        inited: false,
      },
      // 一级分类
      sidebarData: [],
      // 二级分类
      TwoCategory: [],
      sidebarActive: 0, // 一级分类
      tabsActive: 0, // 二级分类
      showClassification:false, // 是否显示侧边栏 一级二级
      searchVal:'' // 搜索value
    }
  },
  props:{
    //搜索
    search:{
      type:String,
      default:''
    },
  },
  watch:{
    'search': {
      deep: true,
      handler (newVal, oldVal) {
        this.searchVal = newVal
        console.log(this.searchVal,'no1');
      }
    },
  },
  computed: {
    // 当前显示二级分类,返回当前选中的二级分类对象
    tabsData() {
      if (this.tabsActive == -1) {
        return _.cloneDeep(this.preTabsData)
      } else {
        if(!this.sidebarData){
          let curOne,arr = []
          return
        }
        let curOne = this.sidebarData[this.sidebarActive]
        let arr = this.TwoCategory.filter(item => item.superId === curOne.id)
        this.preTabsData = _.cloneDeep(arr)
        return arr
      }
    },
    // 当前二级的名字
    curTab() {
      return this.tabsData[this.tabsActive]
    }
  },
  created() {},
  mounted(){
  },
  methods: {
    onLoadMore() {
      if (this.vanList.finished || !this.vanList.inited) return
      if (!this.vanList.myError) {
        this.goodsQuery['pageIndex'] += 1
      }
      this.fetchGoodsList('loadMore')
    },
    async fetchGoodsList(flag = 'init') {
      this.goodsQuery['keyword'] = this.searchVal
      this.goodsQuery['proType'] = this.proTypeList[this.proTypeList.findIndex(item => item.value === this.goodsType)].value
      console.log('列表请求参数=>', this.goodsQuery)

      // 如果是(3=原料)和(0=其他)不用调用，recommendProductCategoryList
      if([3,0].indexOf(this.goodsQuery.proType) === -1){
        this.showClassification= true
        // 如果是有分类id 不用获取分类
        if(!this.goodsQuery['cateCode']){
          let data = await recommendProductCategoryList(this.goodsQuery)
          // 如果分类列表是空则不搜索
          if(!data.productOneCategory && !data.partsOneCategory){
            [this.goodsList ,this.sidebarData ,this.TwoCategory] = [[],[],[]]
            return 
          }
          //获取商品分类
          this.getClassification(this.goodsQuery.proType,data)
          console.log(this.goodsQuery['cateCode'],'this.goodsQuer');
        }
      }else{
        this.showClassification =  false
      }
      
      return searchRecommendProduct(this.goodsQuery).then(async res => {
        // console.log('产品列表', res.records)
        let resultList = res.list
        let isFinish = res.pages === 0 || res.pages === this.goodsQuery.pageIndex // 是否还有下一页
        // console.log('isFinish', isFinish)
        this.vanList.finished = isFinish
        if (flag === 'init') {
          this.goodsList = resultList
          this.$emit('goodsList',this.goodsList)
          if (isFinish && resultList.length > 0) {
            this.vanList.finishedText = '已经到底啦'
          } else {
            this.vanList.finishedText = '暂无数据'
          }
        }
        if (flag === 'loadMore') {
          this.goodsList = this.goodsList.concat(resultList)
          this.$emit('goodsList',this.goodsList)

          if (isFinish) {
            this.vanList.finishedText = '已经到底啦'
          }
        }
        this.vanList.error = false
        this.vanList.myError = false
      }).catch(error => {
        this.vanList.myError = true
        this.vanList.error = true
        console.log('ciuosssss');
      }).finally(() => {
        this.vanList.inited = true
        this.vanList.loading = false
      })
    },
    //获取分类
    getClassification(flag,data){
     if(flag == 1){
        this.sidebarData = data.productOneCategory
        this.TwoCategory = data.productTwoCategory
        let cateCode = this.TwoCategory.find( item=> item.superId == this.sidebarData[0].id )
         // 如果没有二级,默认拿一级id
        if(!cateCode){
          this.goodsQuery['cateCode'] = data.productOneCategory[0].code
          return
        }
        this.goodsQuery['cateCode'] = cateCode.code
      }else if(flag == 2){
        this.sidebarData = data.partsOneCategory
        this.TwoCategory = data.partsTwoCategory
        let cateCode = this.TwoCategory.find( item=> item.superId == this.sidebarData[0].id )
         // 如果没有二级,默认拿一级id
        if(!cateCode){
          this.goodsQuery['cateCode'] = data.partsOneCategory[0].code
          return
        }
        this.goodsQuery['cateCode'] = cateCode.code
      }
    },
    //top-tab
    onGoodsTypeChange(item) {
      this.resetGoodsQuery()
      this.fetchGoodsList()
    },
    // 重置
    resetGoodsQuery() {
      this.goodsQuery['pageIndex'] = 1
      this.goodsQuery['cateCode'] = ''
      this.sidebarActive = 0
      this.vanList.error = false
      this.vanList.myError = false
    },
    
    // 一级竖tab
    onSidebarClick(item, index) {
      if (index === this.sidebarActive) return
      this.$refs['supplier-box'].scrollTop = 0
      this.sidebarActive = index
      this.tabsActive = 0
      // 获取一层分类的第一个 , 如果 二级没有使用一级的id
      if(this.tabsData.length == 0){
        this.goodsQuery['cateCode'] = item.code 
      }else{
        this.goodsQuery['cateCode'] = this.tabsData.find( arr=> arr.superId == item.id ).code
      }
      console.log(item,'item');
      this.fetchGoodsList()
    },
    // 二级tab
    onTabsChange(name, title) {
      this.$refs['supplier-box'].scrollTop = 0
      this.supplierList = []
      this.goodsQuery['cateCode'] = this.tabsData[name].code
      this.fetchGoodsList()
    },
  },
  
}
</script>

<style lang="scss" scoped>
#find-page{

  #content-wrapper{
    flex: 1;
    overflow-y: auto;
    display: flex;
    #sidebar{
      height: 100%;
      overflow-y: auto;
      // flex: 0 0 100px;
      width: 100px;
      display: flex;
      flex-direction: column;
      background-color: #F9F9F9;
      height: calc(100vh - 120px);
      border-right: 1px solid #f6f7f8;
      padding-bottom: 50px;
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
      height: calc(100vh - 120px);
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
          img{
            max-width: 90%;
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
}

/deep/ .van-tab__text{
  display: block;
  text-align: center;
  padding-left:10px; 
  padding-right:10px; 
}


</style>
