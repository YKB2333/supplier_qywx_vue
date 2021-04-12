<template>
  <div id="LatestNews">
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 最新资讯 -->
        <div class="mt20">
          <BaseImageList
            v-for="item in list"
            :key="item.id"
            style="margin-bottom:24px;"
            :title="item.title"
            :src="item.titleImage"
            :value="showRecentTime(item.createTimestamp)"
            type="left"
            is_link
            imgClass="w100 h100 object-contain"
            :to="{path:'newsdetails',query:{id:item.id}}"
          ></BaseImageList>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { selectPage as cmsSelectPage } from '@/api/cmsInfo'
import { cmsCategoryId } from '@/config'
import { isEmpty, showRecentTime } from '@/utils'
import BaseImageList from '@/components/BaseImageList'

export default {
  name: 'CustCases',
  components: {
    BaseImageList
  },
  mixins: [],
  data() {
    return {
      pullRefreshLoading: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: []
    }
  },
  mounted() {},
  computed: {},
  methods: {
    showRecentTime,
    onLoad() {
      cmsSelectPage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        infoCategoryId: cmsCategoryId.custCase,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      })
        .then(res => {
          if (isEmpty(res.records)) {
            this.finished = true
          }
          res.records.forEach(item => {
            this.list.push(item)
          })
        })
        .catch(err => {
          this.finished = true
        })
        .finally(() => {
          // 加载状态结束
          this.loading = false
          this.pullRefreshLoading = false
        })
    },
    onPullRefreshLoad() {
      this.pullRefreshLoading = true
      this.pageIndex = 1
      this.list = []
      this.onLoad()
    }
  },
  destroyed() {}
}
</script>

<style lang="scss" scoped>
#LatestNews {
  height: 100vh;
  overflow-x: hidden;
  background: white;
}
</style>