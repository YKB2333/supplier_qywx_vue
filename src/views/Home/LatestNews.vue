<template>
  <div id="LatestNews">
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <van-list
        v-model="loading" 
        :finished="finished" 
        finished-text="没有更多了" 
        @load="onLoad" 
        :immediate-check="false"
      >
        <!-- 最新资讯 -->
        <div v-if="$route.query.type != 'newProduct'">
          <BaseImageList
            v-for="item in list"
            :key="item.id"
            :title="item.title"
            :src="item.titleImage"
            style="padding: 24px 0;"
            type="right"
            border
            is_link
            imgClassSon="object-contain"
            :value="showCreateTime(item.createTimestamp)"
            :to="{path:'newsdetails',query:{id:item.id}}">
          </BaseImageList>
        </div>

        <div v-else>
          <BaseImageList
            v-for="(item,index) in list"
            :key="index"
            style="padding: 24px 0;"
            type="right"
            border
            is_link
            imgClassSon="object-contain"
            :to="{path:'/product/details/index',query:{id:item.id}}"
          >
            <!-- <template v-slot:img>
              <div class="w100 h100 col center-x" style="background:#F9F9F9">
                <img :src="item.titleImage" class="object-contain " style="width:100%;height:100%" />
              </div>
            </template> -->
            <template v-slot:img>
              <div class="w120 h90 col center-x" style="background:#F9F9F9;position:relative">
                <img :src="require('@/assets/images/home/home_tag_new.png')" v-if="item.isNewProduct||item.isNewProduct==true" class="tag-img" />
                <img :src="item.titleImage" class="object-contain " style="width:100%;height:100%" />
              </div>
            </template>
            <template v-slot:title>
              <div style="color:#262626" class="mt10">
                <p class="fs16 fw500 ellipsis" >{{ item.name }}</p>
                <p v-if="item.supInfo" class="fs13 mt4 ellipsis" style="color:#AFAFAF">{{ item.supInfo.name }}</p>
              </div>
              <div style="color:#AFAFAF" class="mt14">
                <span class="fs12 " >上新时间：{{ showRecentTime(item.createDate) }}</span>
              </div>
            </template>
          </BaseImageList>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { selectRecommendProductPage } from "@/api/supplier";
import { selectPage as cmsSelectPage } from '@/api/cmsInfo'
import { cmsCategoryId } from '@/config'
import { isEmpty, showRecentTime,showCreateTime } from '@/utils'
import BaseImageList from '@/components/BaseImageList'
import { savePosition }  from '@/mixins'

export default {
  name: 'LatestNews',
  components: {
    BaseImageList
  },
  mixins: [new savePosition('LatestNews')],
  data() {
    return {
      pullRefreshLoading: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: [],
      infoCategoryId:'',
    }
  },
  created(){

    this.isType();
  },
  mounted() {
  },
  computed: {},
  methods: {
    showCreateTime,
    showRecentTime,

    isType(){
      if(this.$route.query.type == 'newProduct'){
        this.infoCategoryId = cmsCategoryId.newProduct
        document.title = '供应商推荐新品'
      }
      if(this.$route.query.type == 'custCase'){
        this.infoCategoryId = cmsCategoryId.custCase
        document.title = '经典案例分享'
      }
      if(this.$route.query.type == 'newest'){
        this.infoCategoryId = cmsCategoryId.newsInfo
        document.title = '最新资讯'
      }
      this.onLoad()
    },
    fetchNewProductData() {
      return selectRecommendProductPage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        infoCategoryId: this.infoCategoryId,
        status: '1',
        isOnSale: true,
        name: '',
        proType: '',
        orderStr: 'checkedDate desc ,createDate desc'
      }).then(res => {
          res.records.forEach(item=>{
            item.title = item.name
            item.createTimestamp = item.createDate
          })
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
    fetchCmsSelectPage(){
      return cmsSelectPage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        infoCategoryId: this.infoCategoryId,
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
    onLoad() {
      if(this.$route.query.type == 'newProduct'){
        this.fetchNewProductData()
        return
      }
        this.fetchCmsSelectPage()
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
.tag-img{
  position: absolute;
  top: 0;
  left: 8px;
  width: 20px;
  height: 23px;
  z-index: 2;
}
</style>