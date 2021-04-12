<template>
  <div class="min-h-full">
    <!-- 采购业务工具 -->
    <div style="color: #393C41;" class="plr16 ptb16 fw600 fs18">采购业务工具</div>
    <div class="grid-wrapper">
      <van-grid :border="false" :column-num="2">
        <van-grid-item v-for="(item, index) in toolsList" :key="index" @click="$router.push({ path: '/newsdetails', query: { id: item.id, title: item.title, showDate: false } })">
          <img :src="item.titleImage || require('@/assets/images/logo.png')">
        </van-grid-item>
      </van-grid>
    </div>
    <div class="h10" style="background-color:#F6F6F6;"></div>
    <!-- 采购培训课程 -->
    <base-title title="采购培训课程" icon is-value is_link to="/purchaseCourseList" />
    <info-card
      v-for="(item, index) in courseList" :key="index"
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
    <div class="h10" style="background-color:#F6F6F6;"></div>
    <!-- 行业资讯共享 -->
    <!-- <base-title title="行业资源共享" icon is-value is_link to="/saletools?type=share" /> -->
    <base-title title="行业资源共享" icon is-value is_link to="/shareList" />
    <info-card
      v-for="(item) in information" :key="item.id"
      :title="item.title"
      border
      :title-image="item.titleImage"
      :is-collect="item.collected"
      :is-like="item.like"
      :likeCount="item.likeCount"
      @collect="onCollect(item)"
      @like="onLike(item)"
      @click.native="$router.push({ path: '/shareDetails', query: { id: item.id } })"
    />
  </div>
  
</template>

<script>
import BaseTitle from '@/components/BaseTitle'
import InfoCard from '@/components/InfoCard'
import { getInfoList, addCollect, cancelCollect, addLike, cancelLike  } from '@/api/common'

export default {
  name: 'GrowthBook',
  components: { BaseTitle, InfoCard },
  data() {
    return {
      toolsList: [],
      courseList: [],
      information:[],
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchPurchaseTools()
      this.fetchPurchaseCourse()
      this.fetcinformation()
    },
    // 采购业务工具列表
    fetchPurchaseTools() {
      getInfoList({
        pageIndex: 1,
        pageSize: 100,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc',
        infoCategoryId: this.$config.cmsCategoryId['purchaseBusinessTools']
      }).then(res => {
        this.toolsList = res.records
      })
    },
    // 采购培训课程列表
    fetchPurchaseCourse() {
      getInfoList({
        pageIndex: 1,
        pageSize: 3,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc',
        infoCategoryId: this.$config.cmsCategoryId['purchaseTrainCourse']
      }).then(res => {
        this.courseList = res.records
      })
    },
    fetcinformation() {
      getInfoList({
        pageIndex: 1,
        pageSize: 3,
        status: '1',
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc',
        infoCategoryId: this.$config.cmsCategoryId['information']
      }).then(res => {
        this.information = res.records
      })
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
.grid-wrapper{
  padding: 0px 10px;
  /deep/ .van-grid-item__content{
    padding: 6px 6px;
  }
}
</style>
