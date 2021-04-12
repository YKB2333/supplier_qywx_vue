<template>
  <section class="page" id="scroll">
    <!-- 总页面头部 -->
    <div class="Mymessage">
      <div class="swiper-wrapper classification">
        <span class="swiper-slide" v-for="item in pageTitle" :key="item.id">{{ item.name }}</span>
        <span class="search" @click="setShowSearch">
          <img :src="require('@/assets/images/msg/mess_icon_sea@2x.png')" alt />
        </span>
      </div>
      <!-- 搜索 -->
      <div v-if="showSearch">
        <van-field v-model="keyWord" center clearable ref="search" placeholder="请输入搜索内容" >
          <van-button slot="button" size="small" type="info" @click="onSearch">搜索</van-button>
          <van-button slot="button" size="small" type="default" @click="onReset">取消</van-button>
        </van-field>
      </div>
    </div>

    <!-- 总页面主体内容 -->
    <div class="Mymessage-top">
      <div class="swiper-wrapper heightAuto">

        <!-- 发起 -->
        <div class="swiper-slide MymessageDiv">
          <van-pull-refresh v-model="pullRefreshMyMsgLoading" @refresh="onPullRefreshMyMsgLoad">
            <van-list
              v-model="myMsgLoading"
              :finished="myMsgFinished"
              finished-text="没有更多了"
              @load="onMyMsgLoad"
            >
              <BaseDefaultNull  :show='!myMsgList.length'></BaseDefaultNull>
              <ul class="messageList">
                <li
                  class="message-row_list"
                  v-for="item in myMsgList"
                  :key="item.id"
                  @click="$router.push({ name: 'PurchaseDetails', query: { msgId: item.id,type:'purchase' }})"
                >
                  <div class="wpct92 mauto ptb22 oneBorder" >
                    <p class="ellipsis" style="color:#262626">{{ item.title }}</p>
                    <div class="mt10 row space-between">
                      <span class="fs14 " style="color:#AFAFAF">{{item.sendUserName}} · {{showRecentTime(item.createTimestamp)}} </span>
                      <span class="fs12  " style="color:#ED7874" >{{ !item.lastNotice || item.lastNotice.readStatus ? '' : '未读' }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </van-list>
          </van-pull-refresh>
        </div>

        <!-- 接受 -->
        <div class="swiper-slide MymessageDiv">
          <van-pull-refresh v-model="pullRefreshRecMsgLoading" @refresh="onPullRefreshRecMsgLoad">
            <van-list
              v-model="recMsgLoading"
              :finished="recMsgFinished"
              finished-text="没有更多了"
              @load="onRecMsgLoad"
            >
              <BaseDefaultNull  :show='!recMsgList.length'></BaseDefaultNull>
              <ul class="messageList">
                <li
                  class="message-row_list"
                  v-for="item in recMsgList"
                  :key="item.id"
                  @click="$router.push({ name: 'PurchaseDetails', query: { msgId: item.id }})"
                >
                  <div class="wpct92 mauto ptb22 oneBorder" >
                    <p class="ellipsis" style="color:#262626">{{ item.title }}</p>
                    <div class="mt10 row space-between">
                      <span class="fs14 " style="color:#AFAFAF">{{item.sendUserName}} · {{showRecentTime(item.createTimestamp)}} </span>
                      <span class="fs12  " style="color:#ED7874" >{{ !item.lastNotice || item.lastNotice.readStatus ? '' : '未读' }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </van-list>
          </van-pull-refresh>

        </div>
      </div>

      <!-- 发起留言 -->
      <div class="startMessage" @click="$router.push('/newmessage?type=purchase')">
        <img :src="require('@/assets/images/msg/mess_icon_add@2x.png')" alt />
      </div>
    </div>
  </section>
</template>

<script>
import { myMsgPage, recMsgPage,noticePage,myMsgCount } from '@/api/message'
import { currentUser, currentUserByUserId } from '@/api/user'
import { savePosition } from '@/mixins'
import { List } from 'vant'
import { isEmpty, showRecentTime } from '@/utils'
import { apiAgent } from '@/config'
import BaseDefaultNull from "@/components/BaseDefaultNull";
import Swiper from "swiper";


export default {
  name: 'PurchaseMessage',
  components: {BaseDefaultNull},
  mixins: [new savePosition('scroll')],
  data() {
    return {
      myMsgPageIndex: 1,
      myMsgLoading: false,
      myMsgFinished: false,
      myMsgList: [],
      recMsgPageIndex: 1,
      recMsgLoading: false,
      recMsgFinished: false,
      recMsgList: [],
      wxUserCache: {},
      pageTitle: [{ id: 1, name: '发起' }, { id: 2, name: '接收' }], // 页面不同title
      showSearch: false,
      pullRefreshMyMsgLoading: false,
      pullRefreshRecMsgLoading: false,
      keyWord: '',
      isSearched: false
    }
  },
  activated() {
    // console.log('activated')
  },
  mounted() {
    // console.log('mounted')
    this.getSwiperInit() //初始化滑动-主体
  },
  computed: {},
  methods: {
    isEmpty,
    showRecentTime,
    onMyMsgLoad() {
      myMsgPage({
        msgType:'3',
        sysTag: apiAgent,
        keyWord: this.keyWord,
        pageIndex: this.myMsgPageIndex++,
        pageSize: 10
      })
        .then(async res => {
          console.log(res);
          if (this.isEmpty(res.list)) {
            this.myMsgFinished = true
          } else {
            for (let item of res.list) {
              this.myMsgList.push(item)
              //不存回复信息，取自己
              if (this.wxUserCache[item.userId]) {
                item.avatar = this.wxUserCache[item.userId].avatar
                item.sendUserName = this.wxUserCache[item.userId].name
              } else {
                await currentUserByUserId(item.userId).then(wxUser => {
                  this.wxUserCache[item.userId] = wxUser
                  item.avatar = wxUser.avatar
                  item.sendUserName = wxUser.name
                })
              }
            }
          }
        })
        .catch(err => {
          this.myMsgFinished = true
        })
        .finally(() => {
          // 加载状态结束
          this.myMsgLoading = false
          this.pullRefreshMyMsgLoading = false
        })
    },
    onRecMsgLoad() {
      recMsgPage({
        msgType: '3',
        sysTag: apiAgent,
        keyWord: this.keyWord,
        pageIndex: this.recMsgPageIndex++,
        pageSize: 10
      })
        .then(async res => {
          console.log(res,'接受');
          console.log(res.list);
          console.log(this.isEmpty(res.list));
          if (this.isEmpty(res.list)) {
            this.recMsgFinished = true
          } else {
            for (let item of res.list) {
              this.recMsgList.push(item)
              if (this.wxUserCache[item.userId]) {
                item.avatar = this.wxUserCache[item.userId].avatar
                item.sendUserName = this.wxUserCache[item.userId].name
              } else {
                  // item.sendUserName = '众上'
                await currentUserByUserId(item.userId).then(wxUser => {
                  this.wxUserCache[item.userId] = wxUser
                  item.avatar = wxUser.avatar
                  item.sendUserName = wxUser.name
                })
              }
            }
          }
        })
        .catch(err => {
          this.recMsgFinished = true
        })
        .finally(() => {
          // 加载状态结束
          this.recMsgLoading = false
          this.pullRefreshRecMsgLoading = false
        })
    },
    // 初始化滑动-父盒子
    getSwiperInit() {
      let galleryThumbs = new Swiper('.Mymessage', {
        slidesPerView: 'auto',
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        autoHeight: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(galleryThumbs) {
          galleryThumbs.update() //swiper更新
        }
      })
      let galleryTop = new Swiper('.Mymessage-top', {
        autoHeight: true,
        allowTouchMove: false, //阻止滑动
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        thumbs: {
          swiper: galleryThumbs
        },
        on: {
          slideChangeTransitionStart: () => {}
        },
        onSlideChangeEnd: function(galleryTop) {
          galleryTop.update() //swiper更新
        }
      })
    },
    setShowSearch() {
      this.showSearch = !this.showSearch
      if (!this.showSearch) return
      this.$nextTick(() => {
        this.$refs.search.focus()
      })
    },
    onReset() {
      this.keyWord = ''
      this.setShowSearch()
      if(this.isSearched){
        this.isSearched = false
        this.onPullRefreshMyMsgLoad()
        this.onPullRefreshRecMsgLoad()
      }
    },
    async onSearch() {
      this.isSearched = true
      await (() => {
        this.myMsgLoading = true
        this.myMsgPageIndex = 1
        this.myMsgList = []
        this.onMyMsgLoad()
      })()
      await (() => {
        this.recMsgLoading = true
        this.recMsgPageIndex = 1
        this.recMsgList = []
        this.onRecMsgLoad()
      })()
    },
    onPullRefreshMyMsgLoad() {
      this.pullRefreshMyMsgLoading = true
      this.myMsgPageIndex = 1
      this.myMsgList = []
      this.onMyMsgLoad()
    },
    onPullRefreshRecMsgLoad() {
      this.pullRefreshRecMsgLoading = true
      this.recMsgPageIndex = 1
      this.recMsgList = []
      this.onRecMsgLoad()
    },
    
  }
}
</script>

<style lang="scss" scoped>


.startMessage {
  position: fixed;
  right: 3%;
  bottom: 6%;
  width: 84px;
  z-index: 9999;
  img {
    width: 100%;
  }
}
.Mymessage-top {
  margin-top: 15px;
}
.messageList {
  .messageList-row {
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: 19px 0;
    background: white;
    border-radius: 8px;
    margin-bottom: 16px;
   div:nth-child(1) {
      margin-left: 4%;
      margin-right: 3%;
      border-radius: 50%;
      width: 52px;
      height: 52px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    div:nth-child(2) {
      flex: 1;
      padding-right: 3%;
      color: #393c41;
      font-size: 16px;
      position: relative;
      overflow: hidden;

      p {
        margin: 0;
        padding: 0;
      }
      p:nth-child(1) {
        font-size: 16px;
        color: #393c41;
        span {
          color: #959ca7;
          font-size: 12px;
        }
      }
      p:nth-child(2) {
        font-size: 14px;
        color: #393c41;
        margin-top: 4px;
      }
      span:nth-child(3) {
        position: absolute;
        right: 5%;
        top: 0;
        color: #959ca7;
        font-size: 12px;
      }
    }
  }
}
// 统一标题
.Title-More {
   p{
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

.page {
  overflow-x: hidden;
  height: 100vh;
  // overflow-y: scroll;
  background: rgb(255, 255, 255);
}
// 总盒子
// .findeCustomerDiv {

// }
// .swiper-slide-active {
//   // height: auto;
// }
.swiper-slide-thumb-active {
  position: relative;
  color: #393c41 !important;
}
.swiper-slide-thumb-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
  width: 60%;
  height: 10px;
  border-bottom: 3px solid #57B4B4;
  font-weight: 600;
}

// 按钮
.classification {
  text-align: left;
  width: 92%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  span {
    display: inline-block;
    width: auto !important;
    letter-spacing: 2px;
    font-size: 15px;
    padding: 4px 3px 9px 3px;
    color: #959ca7;
    font-weight: 500;
    text-align: center;
    margin-right: 7%;
  }
  .search {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    margin: 0;
    img {
      width: 20px;
    }
  }
}


.newNews {
  position: relative;
}
.newNews::after {
  content: '';
   position: absolute;
  right: 5%;
  top: 0%;
  width: 9px;
  height: 9px;
  background: #ff3750;
  border-radius: 50%;
}
.oneBorder{
  border-top: 1px solid rgba(244,244,244,1);
  // border-bottom: 1px solid rgba(244,244,244,1);
}

</style>