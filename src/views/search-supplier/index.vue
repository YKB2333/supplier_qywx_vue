<template>
  <div>
    <history-search v-model="searchVal" @change-type="changeType" @search="onSearch" :placeholder="type === '0' ? '请输入供应商名称' : '请输入物料名称'"></history-search>
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      :finished-text="isListEmpty || list.length <= 10 ? '' : '没有更多了'"
      :immediate-check="false"
      @load="onLoad"
    >
      <van-grid square :column-num="2" v-if="list.length">
        <van-grid-item v-for="(item, index) in list" :key="index" @click="toDetail(item)">
          <img slot="icon" :src="item.logo || item.titleImage || require('@/assets/images/logo.png')" width="64" height="64" class="object-contain" />
          <div slot="text" class="mt20 plr20 h42">
            <span slot="text" class="fs15 text-center ellipsis2">{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
      <div v-if="isListEmpty" class="text-center mt100">
        <img :src="require('@/assets/images/supplier_empty.png')" width="50%" />
        <p class="fs13 mt12" style="color: #AFAFAF;">没有搜索到任何内容哦</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import HistorySearch from './history-search'
import { searchPage as searchSupList, searchRecommendProduct } from '@/api/supplier'

export default {
  name: 'SearchSupplier',
  components: { HistorySearch },
  data() {
    return {
      searchVal: '',
      isShowSearchPage: false,
      supQuery: { // 供应商搜索
        pageIndex: 1,
        pageSize: 40,
        keyword: '',
        orderType: 1,
        orderProperty: 'orderLevel',
      },
      recQuery: { // 物料搜索
        pageIndex: 1,
        pageSize: 40,
        checkedStatus: '2',
        keyword: '',
        orderType: 1,
        orderProperty: 'orderLevel',
      },
      list: [],
      loading: false,
      error: false,
      finished: false,
      type: '0', // 0 供应商， 1 物料
    }
  },
  computed: {
    isListEmpty() {
      return this.finished && this.list.length === 0
    }
  },
  created() {
    this.type = this.$route.query.type ? String(this.$route.query.type) : '0'
    const title = {
      '0': '搜索供应商/物料',
      '1': '搜索物料',
    }
    document.title = title[this.type]
  },
  methods: {
    onSearch(val) {
      console.log('搜索', val)
      this.resetQuery()
      this.fetchList()
    },
    fetchList() {
      if (this.loading || this.finished || this.error) return
      const fetch = {
        '0': searchSupList,
        '1': searchRecommendProduct
      }
      const query = {
        '0': this.supQuery,
        '1': this.recQuery,
      }
      let params = _.cloneDeep(query[this.type])
      params.keyword = this.searchVal
      this.loading = true
      fetch[this.type](params).then(res => {
        this.list = this.list.concat(res.list)
        this.finished = res.list.length === 0 ? true : false
        this.error = false
        console.log(typeof this.type)
        if (this.type === '0') this.supQuery.pageIndex += 1
        if (this.type === '1') this.recQuery.pageIndex += 1
      }).catch(() => {
        this.error = true
      }).finally(() => {
        this.loading = false
      })
    },
    onLoad() {
      console.log('滚动加载')
      this.loading = false
      if (!this.searchVal) return
      this.fetchList()
    },
    resetQuery() {
      this.list.length = 0
      this.loading = false
      this.error = false
      this.finished = false
      if (this.type === '0') {
        this.supQuery.pageIndex = 1
      } else if (this.type === '1') {
        this.recQuery.pageIndex = 1
      }
    },
    toDetail(item) {
      if (this.type === '0') {
        this.$router.push({
          path:'/detailsmessage',
          query: { id: item.id }
        })
      } else if (this.type === '1') {
        this.$router.push({
          name: 'productDetails',
          query: { id: item.id }
        })
      }
    },
    changeType(type){
      this.type = type
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-search__content{
  background-color: #f6f6f6;
}
</style>