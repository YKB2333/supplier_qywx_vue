<template>
  <div id="message-page">
      <!-- 消息列表 -->
      <BaseTitle title="供应商消息"   > </BaseTitle>
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
              <img :src="item.avatar" alt />
            </div>
            <div v-else>
              <!-- 已读 -->
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
        </ul>
      </van-list>
  </div>
</template>

<script>
import BaseTitle  from  '@/components/BaseTitle';
import { noticePage } from '@/api/message'
import { currentUser, currentUserByUserId } from '@/api/user'
import { isEmpty, showRecentTime } from '@/utils'
import { apiAgent } from '@/config'

export default {
  name: 'SupplierNewsList',
  components: {BaseTitle},
  data() {
    return {
      pageIndex: 1,
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      wxUserCache: {},
      noticeList: []
    }
  },
  computed: {},
  created() {},
  mounted() {},
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
      noticePage({
        msgType:'1',
        sysTag: apiAgent,
        pageIndex: this.pageIndex++,
        pageSize: 10
      })
        .then(async res => {
          if (this.isEmpty(res.list)) {
            this.finished = true
          } else {
            for (let item of res.list) {
              this.noticeList.push(item)
              if (this.wxUserCache[item.sendUserId]) {
                item.avatar = this.wxUserCache[item.sendUserId].avatar
                item.sendUserName = this.wxUserCache[item.sendUserId].name
              } else {
                await currentUserByUserId(item.sendUserId).then(wxUser => {
                  this.wxUserCache[item.sendUserId] = wxUser
                  item.avatar = wxUser.avatar
                  item.sendUserName = wxUser.name
                })
              }
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
      this.$router.push({ path: 'MessageDetail', query: { msgId: data.msgId } })
    },
    onPullRefreshLoad() {
      this.pullRefreshLoading = true
      this.pageIndex = 1
      this.noticeList = []
      this.onLoad()
    },
    showRecentTime,
    isEmpty
  }
}
</script>

<style lang="scss" scoped>
#message-page {
  // height: 100vh;
  overflow-x: hidden;
  background: white;
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


</style>
