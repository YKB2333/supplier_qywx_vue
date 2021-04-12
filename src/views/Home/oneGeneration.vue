<template>
  <div id="page">
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <div class="richText" v-html="info.content"></div>

      <div class="Title-More" v-if="list.length">
        <p>典型一件代发案例</p>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="IndustryInformation">
          <li
            v-for="item in list"
            :key="item.id"
            @click="$router.push({
            name: 'OneGenerationDetails',
            query: {
              id: item.id
            }
          })"
          >
            <div>
              <p class="ellipsis2">{{item.title}}</p>
              <p>{{showRecentTime(item.createTimestamp)}}</p>
            </div>
            <div>
              <img :src="item.titleImage" alt />
            </div>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { selectPage as cmsSelectPage } from '@/api/cmsInfo'
import { getOne } from '@/api/cmsInfo'
import { cmsCategoryId } from '@/config'
import { isEmpty, showRecentTime } from '@/utils'
export default {
  name: 'OneGeneration',
  components: {},
  data() {
    return {
      pullRefreshLoading: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      list: [],
      info: {}
    }
  },
  computed: {},
  created() {
    this.fetchCmsInfoData()
  },
  methods: {
    isEmpty,
    showRecentTime,
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res
      })
    },
    onLoad() {
      cmsSelectPage({
        pageIndex: this.pageIndex++,
        pageSize: 10,
        infoCategoryId: cmsCategoryId.onePkg,
        status: '1',
        isRecommend: false,
        orderStr: 'pubTimestamp desc, createTimestamp desc'
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
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.IndustryInformation {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  li {
    padding: 5.5%;
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
    box-shadow: 0px 2px 11px 0px rgba(159, 190, 240, 0.16);
    border-radius: 8px;
    margin-bottom: 16px;
    div:nth-child(1) {
      width: 70%;
      margin-right: 3%;
      p:nth-child(1) {
        color: #393c41;
        font-size: 15px;
        font-weight: 600;
      }
      p:nth-child(2) {
        margin-top: 3.5%;
        color: #959ca7;
        font-size: 12px;
        span {
          color: #ef9236;
          background: #fdf4ea;
          padding: 2px 4px 2px 4px;
          margin-right: 5%;
        }
      }
    }
    div:nth-child(2) {
      width: 100px;
      height: 76px;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  margin-top: 19px;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
.Title-More {
  p {
    margin: 16px 0 16px 0;
  }
  width: 90%;
  margin: 0 auto;
  font-size: 18px;
  color: black;
  line-height: 21px;
  text-align: left;
  // font-weight: 600;
  // padding-top: 35px;
  // padding-bottom: 19px;
  padding-top: 9.6px;
  padding-bottom: 3.2px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-line-pack: center;
  align-content: center;
  div {
    color: #959ca7;
    font-weight: 500;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  i {
    margin-top: -3px;
  }
}
</style>
