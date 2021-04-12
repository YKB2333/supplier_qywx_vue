<template>
  <div class="h-full col">
    <custom-radio-group @change="onChange" :count="count" :router-type="routerType">
    </custom-radio-group>
    <div class="split-border flex-1 hidden row">
      <van-sidebar v-if="isShowCate" v-model="cateOneIndex" @change="oneCateChange" ref="sidebar">
        <van-sidebar-item v-for="item in cateOneList" :key="item.id" :title="item.name" />
      </van-sidebar>
      <div class="flex-1 y-scroll col" >
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
        <div class="flex-1 y-scroll plr6 pb20" id="scroll-list" ref="list">
          <van-list
            v-model="loading"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            finished-text="没有更多数据了"
            :immediate-check="false"
            @load="onLoad"
          >
            <van-row gutter="10" class="plr6">
              <van-col :span="isShowCate ? 8 : 6" v-for="item in list" :key="Number(item.id)" class="mt14" @click="toDetail(item)">
                <div class="van-hairline--surround relative w-h74 mauto">
                  <img class="tag" v-if="item.checkedStatus == '1' && !item.code" :src="require('@/assets/images/icon_temp_supplier.png')" />
                  <img :src="item.logo || require('@/assets/images/logo.png')" class="w-h-full object-contain">
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
import { getSupCateList, searchPage as searchSupList, getSupTypeCount } from '@/api/supplier'
import { debounce } from "@/utils";
import axios from 'axios'

export default {
  props: {
    routerType: String
  },
  components: {
    CustomRadioGroup
  },
  mounted( ) {
  },
  data() {
    return {
      cateOneIndex: 0,
      cateTwoIndex: 0,
      cateQuery: {
        type: '1', // 供应类型:0:其他，1：成品，2：配件，3：原料
        productType: '', // 成品类型：1：品牌供应商、2：ODM供应商、3：OEM供应商
      },
      query: {
        pageIndex: 1,
        pageSize: 40,
        orderType: 1,
        orderProperty: 'orderLevel',
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
        other: 0,
        brand: 0,
        odm: 0,
        oem: 0
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
      return ['1', '2'].includes(this.cateQuery.type) && this.cateOneList.length
    }
  },
  methods: {
    init() {
      this.fetchCateList()
      this.fetchCount()
    },
    // 获取数量
    fetchCount() {
      getSupTypeCount('0').then(res => {
        this.count.other = res || 0
        // console.log('其他', res)
      })
      getSupTypeCount('1').then(res => {
        this.count.finishedProducts = res || 0
        // console.log('成品', res)
      })
      getSupTypeCount('2').then(res => {
        this.count.accessory = res || 0
        // console.log('配件', res)
      })
      getSupTypeCount('3').then(res => {
        this.count.materials = res || 0
        // console.log('原料', res)
      })
      getSupTypeCount('1', '1').then(res => {
        this.count.brand = res || 0
        // console.log('品牌供应商', res)
      })
      getSupTypeCount('1', '2').then(res => {
        this.count.odm = res || 0
        // console.log('ODM供应商', res)
      })
      getSupTypeCount('1', '3').then(res => {
        this.count.oem = res || 0
        // console.log('OEM供应商', res)
      })
    },
    // 获取分类数据
    async fetchCateList() {
      let res = await getSupCateList(this.cateQuery)
      if (this.cateQuery.type === '1') {
        this.cateOneList = res.productOneCategory
        this.totalCateTwoList = res.productTwoCategory
      } else if (this.cateQuery.type === '2') {
        this.cateOneList = res.partsOneCategory
        this.totalCateTwoList = res.partsTwoCategory
      }
      if (this.cateOneList.length) {
        if (this.cateOneList[0] && this.cateOneList[0].id !== -999) {
          this.cateOneList.unshift({ name: '全部', id: -999, code: '' })
        }
      }
      if (this.cateOneList.length && this.cateOneIndex > this.cateOneList.length - 1) {
        this.cateOneIndex = 0
      }
      
      this.fetchList()
    },
    // 获取列表
    fetchList: debounce(async function () {
      // this.$toast.loading({ mask: true })
      try {
        if (this.loading || this.finished || this.error) return
        this.loading = true
        let copySupQuery = _.cloneDeep(this.query)
        let copyCateQuery = _.cloneDeep(this.cateQuery)
        copySupQuery.oneCode = this.isShowCate && this.cateOneList[this.cateOneIndex] ? this.cateOneList[this.cateOneIndex].code : ''
        copySupQuery.twoCode = this.isShowCate && this.cateTwoList[this.cateTwoIndex] ? this.cateTwoList[this.cateTwoIndex].code : ''
        let params = Object.assign(copyCateQuery, copySupQuery)
        let res = await searchSupList(params, new axios.CancelToken((c) => { this.cancelHttp = c }))
        if(res.list.length !== 0){
          this.list = this.list.concat(res.list)
        }
        this.finished = res.list.length === 0 ? true : false
        this.query.pageIndex += 1
        this.error = false
      } catch (error) {
        console.log(error, 'error')
        this.error = true
      } finally {
        this.loading = false
        // this.$toast.clear()
      }
    }),
    // 成品、配件、原料、其他切换
    onChange({ type, productType }) {
      this.cancelHttp && this.cancelHttp()
      this.resetQuery()
      this.cateQuery.type = type
      this.cateQuery.productType = productType
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
        path:'/detailsmessage',
        query: { id: item.id }
      })
    },
    // 保存滚动条位置
    saveScrollTop() {
      if (this.$refs['sidebar']) {
        this.sidebarTop = this.$refs['sidebar'].scrollTop || 0
      }
      if (this.$refs['list']) {
        console.log(this.$refs['list']);
        this.listTop = this.$refs['list'].scrollTop || 0
      }
    },
    // 恢复滚动条位置
    resumeScrollTop() {
      if (this.$refs['sidebar']) 
        this.$refs['sidebar'].scrollTop = this.sidebarTop
      
      if (this.$refs['list']) 
        this.$refs['list'].scrollTop = this.listTop
    }
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