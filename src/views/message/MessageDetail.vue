<template>
  <section class="page">
    <ul class="myMessageList">
      <!-- 源发起消息 -->
      <van-loading type="spinner" color="#1989fa" v-if="loading" />
      <li class="myMessageList-row" v-if="!loading" style="border:1px solid rgba(238,238,238,1);">
        <div class="row-one">
          <div>
            <img :src="message.avatar" alt />
          </div>
          <div>
            <p>
              <span class="pos">楼主#</span>
              {{message.sendUserName}}
            </p>
            <p>{{message.title}}</p>
          </div>
        </div>

        <div class="row-two">
          <p>{{message.content}}</p>
        </div>
        <div class="row-three">
          <span>{{showRecentTime(message.createTimestamp)}}</span>
          <template v-if="message.id">
            <span @click="deleteMessage" v-if="message.isMyMsg">
              <img :src="require('@/assets/images/msg/mess_icon_del@2x.png')" alt />
            </span>
            <span v-else @click="getShowInputIndex(-1)">
              <img :src="require('@/assets/images/msg/mess_icon_ly@2x.png')" alt />
            </span>
          </template>
        </div>
        <van-cell-group>
          <van-field
            v-show="-1 === showMsgInputIndex"
            v-model="sms"
            center
            clearable
            :ref="`showMsgInput-1`"
            :placeholder="'回复' + message.sendUserName"
          >
            <van-button
              slot="button"
              size="small"
              :disabled="canSumbit"
              type="info"
              :loading="submitLoading"
              @click="sendReply()"
            >确认</van-button>
          </van-field>
        </van-cell-group>
      </li>
      <!-- 回复 -->
      <li class="myMessageList-row myReply" v-for="(item,index) in replyList" :key="item.id">
        <div class="row-one">
          <div :class="{'newNews':false}">
            <img :src="item.avatar" alt />
          </div>
          <div>
            <p>
              <span class="pos">{{replyList.length - index}}#</span>
              {{item.sendUserName}}
            </p>
            <p v-if="item.replyId">
              回复
              <span class="pos">{{replyFloor[item.replyId]}}#</span>
            </p>
            <p v-else>
              回复
              <span class="pos">楼主#</span>
            </p>
          </div>
        </div>

        <div class="row-two">
          <p>{{item.content}}</p>
        </div>
        <div class="row-three">
          <span>{{showRecentTime(item.createTimestamp)}}</span>
          <span @click="deleteReply(item.id)" v-if="item.isMyMsg">
            <img :src="require('@/assets/images/msg/mess_icon_del@2x.png')" alt />
          </span>
          <span @click="getShowInputIndex(index)" v-else>
            <img :src="require('@/assets/images/msg/mess_icon_ly@2x.png')" alt />
          </span>
        </div>
        <van-cell-group>
          <van-field
            v-show="index === showMsgInputIndex"
            v-model="sms"
            center
            clearable
            :ref="`showMsgInput${index}`"
            :placeholder="'回复' + item.sendUserName"
          >
            <van-button
              slot="button"
              size="small"
              :disabled="canSumbit"
              type="info"
              :loading="submitLoading"
              @click="sendReply(item.id)"
              color="#57B4B4"
            >确认</van-button>
          </van-field>
        </van-cell-group>
      </li>
    </ul>
  </section>
</template>

<script>
import {
  msgDetail,
  replyList as getReplyList,
  msgDelete,
  replyAdd,
  replyDelete
} from '@/api/message'
import { currentUser, currentUserByUserId } from '@/api/user'
import { savePosition } from '@/mixins'
import { isEmpty, showRecentTime } from '@/utils'
import { apiAgent } from '@/config'

export default {
  name: 'MessageDetail',
  components: {},
  mixins: [new savePosition()],
  data() {
    return {
      wxUserCache: {},
      message: {},
      replyList: [],
      replyFloor: {},
      sms: '',
      loading: false,
      submitLoading: false,
      showMsgInputIndex: '' // 当前选中的回复的 index
    }
  },
  async created() {
    await this.fetchMsgDetailData()
    this.fetchReplyListData()
  },
  mounted() {},
  computed: {
    canSumbit() {
      return isEmpty(this.sms)
    }
  },
  methods: {
    showRecentTime,
    fetchMsgDetailData() {
      this.loading = true
      return msgDetail(this.$route.query.msgId)
        .then(async res => {
          if (this.wxUserCache[res.userId]) {
            res.avatar = this.wxUserCache[res.userId].avatar
            res.sendUserName = this.wxUserCache[res.userId].name
          } else {
            await currentUserByUserId(res.userId).then(wxUser => {
              this.wxUserCache[res.userId] = wxUser
              res.avatar = wxUser.avatar
              res.sendUserName = wxUser.name
            })
          }
          this.message = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchReplyListData() {
      return getReplyList(this.message.id).then(async res => {
        this.replyList = []
        this.replyFloor = {}
        for (let item of res) {
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
          this.replyFloor[item.id] = item.sendUserName
          this.replyList.push(item)
        }
      })
    },
    // 获取当前点击的input框的值
    getShowInputIndex(index) {
      this.showMsgInputIndex = index
      this.$nextTick(() => {
        // console.info(this.$refs)
        let my = this.$refs[`showMsgInput${index}`]
        index === -1 ? my.focus() : my[0].focus()
      })
    },
    deleteMessage() {
      this.$dialog
        .confirm({
          title: '确认删除?',
          message: '您确认删除本条留言吗'
        })
        .then(() => {
          // on confirm
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            overlay: true,
            forbidClick: true,
            message: '正在删除'
          })
          msgDelete(this.message.id)
            .then(res => {
              this.$toast.success('删除成功')
              this.$store.commit('REMOVE_CACHE_PAGE', 'MyMessage')
              this.$router.push({ path: '/mymessage' })
            })
            .finally(() => {
              this.$toast.clear()
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    deleteReply(replyId) {
      this.$dialog
        .confirm({
          title: '确认删除?',
          message: '您确认删除本条回复吗'
        })
        .then(() => {
          // on confirm
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            overlay: true,
            forbidClick: true,
            message: '正在删除'
          })
          replyDelete(replyId)
            .then(res => {
              this.$toast.success('删除成功')
              this.fetchReplyListData()
            })
            .finally(() => {
              this.$toast.clear()
            })
        })
        .catch(() => {
          // on cancel
        })
    },
    sendReply(replyId) {
      this.$dialog
        .confirm({
          title: '确认提交回复?',
          message: '您确认提交本条回复吗'
        })
        .then(() => {
          // on confirm
          this.submitLoading = true
          replyAdd({
            sysTag: apiAgent,
            msgId: this.message.id,
            content: this.sms,
            replyId: replyId
          })
            .then(res => {
              this.sms = ''
              this.showMsgInputIndex = ''
              this.$toast.success('回复成功')
              this.fetchReplyListData()
            })
            .finally(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  overflow-x: hidden;
  background: white;
}

.myMessageList {
  padding-top: 16px;
  .myMessageList-row {
    width: 90%;
    margin: 0 auto;
    margin-top: 2%;
    padding: 19px 0 0 0;
    background: white;
    box-shadow: 0px 2px 16px 0px rgba(159, 190, 240, 0.16);
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
    .row-one {
      display: flex;
      align-items: flex-start;
      margin: 0 auto;
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
        p {
          margin: 0;
          padding: 0;
        }
        p:nth-child(1) {
          font-size: 16px;
          color: #393c41;
          line-height: 16px;
        }
        p:nth-child(2) {
          font-size: 14px;
          color: #6b7178;
          margin-top: 4px;
        }
      }
    }
    .row-two {
      width: 90%;
      margin: 0 auto;
      p {
        // padding: 16px 0 16px 0;
        margin: 16px 0 16px 0;
        font-size: 14px;
        color: #393c41;
        line-height: 20px;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .row-three {
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #959ca7;
      font-size: 12px;
      padding-bottom: 19px;
      img {
        width: 22px;
      }
    }
  }
}
//我的回复
.myReply {
  background: rgba(245, 246, 249, 1) !important;
  box-shadow: 0px 2px 16px 0px rgba(159, 190, 240, 0.16) !important;
}
//序号
.pos {
  color: #959ca7;
  font-size: 12px;
  margin-left: 5px;
  margin-right: 5px;
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