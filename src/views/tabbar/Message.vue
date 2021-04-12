<template>
  <div id="message-page">
    <van-pull-refresh v-model="pullRefreshLoading" @refresh="onPullRefreshLoad">
      <!-- 消息固定咧 -->
      <div class="messageHeade">
        <div class="message-row" @click="$router.push('/mymessage')">
          <div>
            <img :src="require('@/assets/images/msg/mess_icon_lea@2x.png')" alt />
          </div>
          <div> <span>留言  </span>   </div>
          <div class="row center-y"><strong class="rednum" v-if="lastmsgCount">{{ lastmsgCount }}</strong></div><van-icon name="arrow" />
        </div>
        <div class="message-row" @click="openCustService">
          <div>
            <img :src="require('@/assets/images/msg/mess_icon_ser@2x.png')" alt />
          </div>
          <div> <span>客服</span>   <van-icon name="arrow" /></div>
        </div>
        <div class="message-row" @click="$router.push('/purchasemessage')">
          <div>
            <img :src="require('@/assets/images/msg/mess_icon_need.png')" alt />
          </div>
          <div> <span>采购需求  </span>   </div>
          <div class="row center-y"><strong class="rednum" v-if="msgCount">{{ msgCount }}</strong></div><van-icon name="arrow" />
        </div>
      </div>
      <!-- 消息列表 -->
      <!-- <BaseTitle title="集团消息"  isValue icon is_link to="/groupnewslist" style="margin-top:19px" > </BaseTitle>
      <ul class="messageList">
        <li
          class="messageList-row"
          v-for="item in noticeList"
          :key="item.id"
          @click="openMessageDetail(item)"
        >
          <div v-if="!item.readStatus" :class="{'newNews':true}">
            <img :src="item.avatar" alt />
          </div>
          <div v-else>
            <img :src="item.avatar" alt />
          </div>
          <div>
            <p>
              {{item.sendUserName}}
              <span>{{ item.noticeType == 1 ? '给您留言' : '' }}{{ item.noticeType == 2 ? '最新回复' : '' }}</span>
            </p>
            <p class=" ellipsis1">{{item.title}}</p>
            <span>{{showRecentTime(item.createTimestamp)}}</span>
          </div>
        </li>
      </ul> -->

      <!-- 供应商消息 -->
      <!-- <BaseTitle title="供应商消息"  isValue icon is_link to="/suppliernewslist" style="margin-top:19px" > </BaseTitle> -->
      <BaseTitle title="供应商消息"   style="margin-top:19px" > </BaseTitle>
      <BaseDefaultNull  :show='!noticeList.length'></BaseDefaultNull>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul class="messageList">
          <li
            class="messageList-row"
            v-for="item in noticeList"
            :key="item.id"
            @click="openMessageDetail(item)"
          >
            <div v-if="!item.readStatus" :class="{'newNews':true}">
              <!-- 未读 -->
              <img :src="item.logo || defaultLogo" alt />
            </div>
            <div v-else>
              <!-- 已读 -->
              <img :src="item.logo || defaultLogo" alt />
            </div>
            <div>
              <p>
                <span class="ellipsis">{{item.sendUserName}}</span>
                <!-- <span>{{ item.noticeType == 1 ? '给您留言' : '' }}{{ item.noticeType == 2 ? '最新回复' : '' }}</span> -->
              </p>
              <p class=" ellipsis ">{{item.title}}</p>
              <span >{{showRecentTime(item.createTimestamp)}}</span>
            </div>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import BaseTitle  from  '@/components/BaseTitle';

import { noticePage,myMsgCount,purchaseNoticeCount,noticeCount,wxMiniAppNoticePage} from '@/api/message'
import { currentUser, currentUserByUserId,getSupInfoByUserId } from '@/api/user'
import { isEmpty, showRecentTime } from '@/utils'
import { apiAgent } from '@/config'
import BaseDefaultNull from "@/components/BaseDefaultNull";


export default {
  name: 'Message',
  components: {BaseTitle,BaseDefaultNull},
  data() {
    return {
      pageIndex: 1,
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      wxUserCache: {},
      noticeList: [],
      msgCount:0,
      lastmsgCount:0,
      defaultLogo: require("@/assets/images/defaultLogo.png"),

    }
  },
  computed: {},
  created() {},
  mounted() {
    this.fetchMsgCount()
    this.fetchlastMsgCount()
    this.onLoad();

  },
  methods: {
    openCustService() {
      let va = this.$config.serviceMan.map(item => item.label).join(';')
      wx.openEnterpriseChat({
        userIds: va, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        groupName: '客服', // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function(res) {
          // 回调
        },
        fail: function(res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      })
    },
    onLoad() {
      wxMiniAppNoticePage({
        pageIndex: this.pageIndex++,
        pageSize: 10
      })
        .then(async res => {
          if (this.isEmpty(res.list)) {
            this.finished = true
          } else {
            for (let item of res.list) {
              if (this.wxUserCache[item.sendUserId]) {
                item.avatar = this.wxUserCache[item.sendUserId].avatar
                item.sendUserName = this.wxUserCache[item.sendUserId].name
              } else {
                await getSupInfoByUserId(item.sendUserId).then(wxUser => {
                  this.wxUserCache[item.sendUserId] = wxUser
                  item.avatar = wxUser.logo
                  item.sendUserName = wxUser.name
                })
              }
              this.noticeList.push(item)
            }
          }
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
    openMessageDetail(data) {
      console.log(data,'data');
      this.$router.push({ path: 'purchasedetails', query: { msgId: data.msgId,type:'wx_min' } })
    },
    onPullRefreshLoad() {
      this.pullRefreshLoading = true
      this.pageIndex = 1
      this.noticeList = []
      this.onLoad()
    },
    showRecentTime,
    isEmpty,
    fetchMsgCount() {
      return purchaseNoticeCount({
        pageIndex:1,
        pageSize:1,
        readStatus:0,
        sysTag:apiAgent
      }).then(res => {
        this.msgCount = res;
      });
    },
    fetchlastMsgCount() {
      return noticeCount({
        pageIndex:1,
        pageSize:1,
        readStatus:0,
        sysTag:apiAgent
      }).then(res => {
        this.lastmsgCount = res;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
#message-page {
  height: 100vh;
  overflow-x: hidden;
  background: white;
}
.messageHeade {
  padding-top: 3%;
}
.message-row {
  width:92%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: white;
  align-items:center;
  height:60px;
  line-height:60px;
  border-bottom:1px solid rgba(244,244,244,1);;

  div:nth-child(1) {
    width: 22px;
    display: flex;
    align-items: center;
    img {
      width: 22px;
    }
  }
  div:nth-child(2) {
    width:100%;
    margin: 0 auto;
    display:flex;
    justify-content: space-between;
    align-items:center;
    margin-left: 16px;
    color: #393c41;
    font-size: 16px;
    i{
      color:#AFAFAF;
    }
  }
}

.messageTitle {
  width: 90%;
  margin: 0 auto;
  margin-top:30px;
  color: #262626;
  font-size: 18px;
  padding-bottom: 24px;
}
.messageList {
  .messageList-row {
    display: flex;
    // align-items: flex-start;
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
        // display: flex;
        // align-items: center;
        color: #393c41;
        span:nth-child(1) {
          display: inline-block;
          width: 80%;
          overflow: hidden;
        }
        span:nth-child(2) {
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
.rednum{
  overflow: hidden;
  display: inline-block;
  width:20px !important;
  height:20px !important;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background:rgba(237,120,116,1);
  color: white;
  margin-right: 5px;
}
/deep/ .van-icon{
  color: #AFAFAF;
}
</style>
