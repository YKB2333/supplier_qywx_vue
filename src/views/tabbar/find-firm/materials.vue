<template>
  <div class="h-full col">
    <custom-radio-group @change="onChange" :count="count" :is-drowdown="false">
    </custom-radio-group>
    <div class="split-border flex-1 hidden row">
      <van-sidebar v-if="isShowCate" v-model="cateOneIndex" @change="oneCateChange" ref="sidebar">
        <van-sidebar-item v-for="item in cateOneList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="flex-1 y-scroll col">
        <van-tabs 
          v-if="isShowCate"
          v-model="cateTwoIndex"
          :ellipsis="false"
          :border="true"
          title-active-color="#57B4B4" 
          title-inactive-color="#afafaf"
          color="transparent"
          @change="onTwoCateChange"
        >
          <van-tab v-for="item in cateTwoList" :key="item.id" :title="item.name"></van-tab>
        </van-tabs>
        <div class="flex-1 y-scroll plr6 pb20" ref="list" id="scroll-list">
          <van-list
            v-model="loading"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            finished-text="没有更多数据了"
            :immediate-check="false"
            @load="onLoad"
          >
            <van-row gutter="10" class="plr6">
              <van-col :span="isShowCate ? 8 : 6" v-for="(item, i) in list" :key="i" class="mt14" @click="toDetail(item)">
                <div class="van-hairline--surround relative w-h74 mauto">
                  <img class="tag" v-if="item.checkedStatus == '1' && !item.code" :src="require('@/assets/images/icon_temp_supplier.png')" />
                  <img :src="item.titleImage || require('@/assets/images/logo.png')" class="w-h-full object-contain">
                </div>
                <div class="h38 mt8">
                  <p class="ellipsis2 fs11 color333 text-center">{{ item.name }}</p>
                </div>
              </van-col>
            </van-row>
            <div v-if="finished && list.length === 0" class="text-center mt100">
              <img :src="require('@/assets/images/supplier_empty.png')" width="50%" />
              <p class="fs13 mt12" style="color: #AFAFAF;">暂无数据</p>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomRadioGroup from './custom-radio-group'
import { recommendProductCategoryList, searchRecommendProduct, getRecommendProductCount } from '@/api/supplier'
import { debounce } from "@/utils";
import axios from 'axios'

export default {
  components: {
    CustomRadioGroup
  },
  data() {
    return {
      cateOneIndex: 0,
      cateTwoIndex: 0,
      cateQuery: {
        proType: '1', // 供应类型:0:其他，1：成品，2：配件，3：原料
      },
      query: {
        pageIndex: 1,
        pageSize: 40,
        orderStr: 'orderLevel desc',
        checkedStatus: '2', // 0待审 1审批中 2审批通过 3审批不通过
      },
      cateOneList: [], // 一级分类
      totalCateTwoList: [], // 全部二级分类
      loading: false,
      error: false,
      finished: false,
      list: [], // 供应商列表
      count: {
        finishedProducts: 0,
        accessory: 0,
        materials: 0,
        other: 0
      },
      sidebarTop: 0,
      listTop: 0,
      cancelHttp: null,
    }
  },
  computed: {
    // 当前一级分类对应的二级分类列表
    cateTwoList() {
      let arr = []
      let curOne = this.cateOneList[this.cateOneIndex]
      if (curOne && curOne.id) {
        arr = this.totalCateTwoList.filter(two => two.superId === curOne.id)
      }
      arr.unshift({ name: '全部', id: -999, code: '' })
      // console.log('当前一级分类对应的二级分类列表', arr)
      return arr
    },
    // 是否显示sidebar tabs 等分类区域
    isShowCate() {
      return ['1', '2'].includes(this.cateQuery.proType)
    }
  },
  methods: {
    init() {
      this.fetchCateList()
      this.fetchCount()
    },
    // 获取数量
    fetchCount() {
      getRecommendProductCount('0').then(res => {
        this.count.other = res || 0
        // console.log('其他', res)
      })
      getRecommendProductCount('1').then(res => {
        this.count.finishedProducts = res || 0
        // console.log('成品', res)
      })
      getRecommendProductCount('2').then(res => {
        this.count.accessory = res || 0
        // console.log('配件', res)
      })
      getRecommendProductCount('3').then(res => {
        this.count.materials = res || 0
        // console.log('原料', res)
      })
    },
    // 获取分类数据
    async fetchCateList() {
      let res = await recommendProductCategoryList(this.cateQuery)
      if (this.cateQuery.proType === '1') {
        this.cateOneList = res.productOneCategory.filter(item => item != null)
        this.totalCateTwoList = res.productTwoCategory.filter(item => item != null)
        this.cateOneList.unshift({ name: '全部', id: -999, code: '' })
      } else if (this.cateQuery.proType === '2') {
        this.cateOneList = res.partsOneCategory.filter(item => item != null)
        this.totalCateTwoList = res.partsTwoCategory.filter(item => item != null)
        this.cateOneList.unshift({ name: '全部', id: -999, code: '' })
      }
      this.fetchList()
    },
    // 获取列表
    fetchList: debounce(async function () {
      // this.$toast.loading({ mask: true })
      try {
        // console.log('fetch')
        // console.log(this.loading, this.finished, this.error)
        if (this.loading || this.finished || this.error) return
        this.loading = true
        let copySupQuery = _.cloneDeep(this.query)
        let copyCateQuery = _.cloneDeep(this.cateQuery)
        if (this.isShowCate && this.cateOneList[this.cateOneIndex] && this.cateOneList[this.cateOneIndex].code) {
          if (this.cateTwoList[this.cateTwoIndex].code) {
            copySupQuery.cateCode = this.cateTwoList[this.cateTwoIndex].code
          } else {
            copySupQuery.cateCode = this.cateOneList[this.cateOneIndex].code
          }
        } else {
          copySupQuery.cateCode = ''
        }
        let params = Object.assign(copyCateQuery, copySupQuery)
        let res = await searchRecommendProduct(params, new axios.CancelToken((c) => { this.cancelHttp = c }))
        this.list = this.list.concat(res.list)
        this.finished = res.list.length === 0 ? true : false
        this.query.pageIndex += 1
        this.error = false
      } catch (error) {
        console.log(error)
        this.error = true
      } finally {
        // this.$toast.clear()
        this.loading = false
      }
    }),
    onChange({ type }) {
      // console.log(type, 'type')
      // console.log(productType, 'productType')
      this.cancelHttp()
      this.resetQuery()
      this.cateQuery.proType = type
      this.fetchCateList()
    },
    // 一级分类切换
    oneCateChange(index) {
      this.resetQuery()
      this.fetchList()
    },
    // 二级分类切换
    onTwoCateChange(name, title) {
      // console.log(name, title)
      this.resetQuery()
      this.fetchList()
    },
    onLoad() {
      // console.log('加载')
      // console.log(this.loading, this.finished, this.error)
      this.loading = false
      this.fetchList()
    },
    resetQuery() {
      this.list.length = 0
      this.query.pageIndex = 1
      this.loading = false
      this.finished = false
      this.error = false
    },
    // 跳转供应商详情
    toDetail(item) {
      this.$router.push({
        name: 'productDetails',
        query: { id: item.id }
      })
    },
    // 保存滚动条位置
    saveScrollTop() {
      if (this.$refs['sidebar'])
        this.sidebarTop = this.$refs['sidebar'].scrollTop || 0
      
      if (this.$refs['list'])
        this.listTop = this.$refs['list'].scrollTop || 0
    },
    // 恢复滚动条位置
    resumeScrollTop() {
      if (this.$refs['sidebar']) 
        this.$refs['sidebar'].scrollTop = this.sidebarTop
      
      if (this.$refs['list']) 
        this.$refs['list'].scrollTop = this.listTop
    },
  }
};
</script>
<style lang="scss" scoped>
.tag{
  position: absolute;
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
}
</style>