<template>
  <div class="ptb20">
    <div>
      <van-list
        v-model="vanList.loading"
        :immediate-check="false"
        :finished="vanList.finished"
        :error.sync="vanList.error"
        :finished-text="vanList.finishedText"
        error-text="请求失败，点击重新加载"
        @load="onLoadMore">
          <info-card
            v-for="(item, index) in list" :key="index"
            :title="item.title"
            :title-image="item.image"
            :is-collect="item.collected"
            hide-like
            @collect="onCollect(item, index)"
            @click.native="$router.push({ path: '/newsdetails', query: { id: item.relationKey } })"
          >
          </info-card>
          <div v-if="vanList.finished && list.length === 0" class="text-center mt100">
            <img :src="require('@/assets/images/supplier_empty.png')" width="50%" />
          </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import InfoCard from '@/components/InfoCard'
import { getCollectList, cancelCollect } from '@/api/common'

export default {
  name: 'CollectList',
  components: { InfoCard },
  data() {
    return {
      list: [],
      vanList: {
        loading: false,
        finished: false,
        finishedText: '',
        error: false,
        myError: false
      },
      query: {
        pageIndex: 1, 
        pageSize: 20,
      },
      inited: false
    }
  },
  computed: {},
  created() {
    this.fetchList()
  },
  methods: {
    onLoadMore() {
      if (this.vanList.finished || !this.inited) return
      if (!this.vanList.myError) {
        this.query['pageIndex'] += 1
      }
      this.fetchList('loadMore')
    },
    fetchList(flag = 'init') {
      return new Promise((resolve, reject) => {
        getCollectList(this.query)
          .then(res => {
            let isFinish = res.list.length === 0 || res.pages === res.pageIndex // 是否还有下一页
            // console.log('isFinish', isFinish)
            this.vanList.finished = isFinish
            if (flag === 'init') {
              this.list = res.list
              if (isFinish && res.list.length > 0) {
                this.vanList.finishedText = '已经到底啦'
              } else {
                this.vanList.finishedText = '暂无数据'
              }
            }

            if (flag === 'loadMore') {
              this.list = this.list.concat(res.list)
              if (isFinish) {
                this.vanList.finishedText = '已经到底啦'
              }
            }
            // 添加收藏字段为true
            this.list.forEach(item => {
              item['collected'] = true
            })

            this.vanList.error = false
            this.vanList.myError = false
            resolve()
          }).catch(error => {
            this.vanList.myError = true
            this.vanList.error = true
            reject()
          }).finally(() => {
            this.vanList.loading = false
            this.inited = true
          })
      })
    },
    resetQuery() {
      this.query['pageIndex'] = 1
      this.vanList.error = false
      this.vanList.myError = false
    },
    // 收藏
    onCollect(item) {
      if (item.collected) { // 取消收藏
        cancelCollect(item.relationKey).then(res => {
          this.list = this.list.filter((value, i) => value.id !== item.id)
        }).catch(error => {
          this.$toast('取消收藏失败')
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
