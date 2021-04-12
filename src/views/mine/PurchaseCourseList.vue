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
            border
            :title="item.title"
            :title-image="item.titleImage"
            :is-collect="item.collected"
            :is-like="item.like"
            :likeCount="item.likeCount"
            @collect="onCollect(item)"
            @like="onLike(item)"
            @click.native="$router.push({ path: '/newsdetails', query: { id: item.id } })"
          />
          <div v-if="vanList.finished && list.length === 0" class="text-center mt100">
            <img :src="require('@/assets/images/supplier_empty.png')" width="50%" />
          </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import InfoCard from '@/components/InfoCard'
import { getInfoList, addCollect, cancelCollect, addLike, cancelLike  } from '@/api/common'

export default {
  name: 'PurchaseCourseList',
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
        pageSize: 10,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc',
        infoCategoryId: this.$config.cmsCategoryId['purchaseTrainCourse']
      },
      inited: false
    }
  },
  computed: {},
  created() {
    this.isType()
    this.fetchList()
  },
  methods: {
    isType(){
      if(this.$route.query.type == 'share'){
        document.title = '行业资源共享'
        this.query.infoCategoryId = this.$config.cmsCategoryId['information']
      }
    },
    onLoadMore() {
      console.info("onLoadMore")
      if (this.vanList.finished || !this.inited) return
      if (!this.vanList.myError) {
        this.query['pageIndex'] += 1
      }
      this.fetchList('loadMore')
    },
    fetchList(flag = 'init') {
      return new Promise((resolve, reject) => {
        // console.log('列表请求参数=>', this.query)
        this.vanList.loading = true
        getInfoList(this.query)
          .then(res => {
            console.log('列表', res.records)
            let isFinish = res.records.length === 0 || res.pages === this.query['pageIndex']  // 是否还有下一页
            // console.log('isFinish', isFinish)
            this.vanList.finished = isFinish
            if (flag === 'init') {
              this.list = res.records
              if (isFinish && res.records.length > 0) {
                this.vanList.finishedText = '已经到底啦'
              } else {
                this.vanList.finishedText = '暂无数据'
              }
            }

            if (flag === 'loadMore') {
              this.list = this.list.concat(res.records)
              if (isFinish) {
                this.vanList.finishedText = '已经到底啦'
              }
            }
            this.vanList.error = false
            this.vanList.myError = false
            resolve( )
          }).catch(error => {
             console.log(error)
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
        cancelCollect(item.id).then(res => {
          item.collected = false
        })
      } else { // 添加收藏
        addCollect({
          id: item.id,
          title: item.title,
          titleImage: item.titleImage,
          contentType: 'purchaseTrainCourse'
        }).then(res => {
          item.collected = true
        })
      }
    },
    // 点赞
    onLike(item) {
      if (item.like) { // 取消点赞
        cancelLike(item.id).then(res => {
          item.like = false
          item.likeCount--
        })
      } else { // 添加点赞
        addLike({
          id: item.id,
          title: item.title,
          titleImage: item.titleImage,
          contentType: 'purchaseTrainCourse'
        }).then(res => {
          item.like = true
          item.likeCount++
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
