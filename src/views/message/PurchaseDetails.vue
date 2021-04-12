<template>
  <div id="page">
    <!-- <div class="caseTitle" v-if="info.title"> -->
    <div class="caseTitle" @click="onReply({id:'',msg:message.content})">
      <p>{{ message.title }}</p>
      <p>
        <span class="mr10" style="color:#5B6A91;">{{ message.sendUserName }}</span>
        {{ showRecentTime(message.createTimestamp)}}
      </p>
    </div>
    <div class="richText" @click="onReply({id:'',msg:message.content})">{{ message.content }}
     
    </div>
    <div class="row flex-end wpct92 mauto">
      <span
        class="fs12 ptb2 pl12 pr12"
        style="color:#5B6A91;background:#eeeeee;border-radius:12px"
        @click="onReply({id:'',msg:message.content})"
      >回复</span>
      <img
        v-if="message.isMyMsg"
        @click="deleteMessage(message.id)"
        :src="require('@/assets/images/msg/mess_icon_del@2x.png')"
        class="w20 ml14"
      />
    </div>
   

    <!-- 回复列表 -->
    <div class="mt20">
      <atta-item
        parent_Class="mb2 p2 wpct92 mauto"
        parent_Style="box-shadow:node"
        v-for="(item, index) in message.attachments"
        :key="index"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaId="index"
        :attaUrl="item.filePath"
      />
    </div>
    <!-- 消息 -->
    <div class="wpct92 mauto mt30 mb30">
      <p class="onepx_border_bottom h50 l-h50">留言</p>
      <!-- 总留言盒子 -->
      <BaseDefaultNull :show='!replyList.length'></BaseDefaultNull>
      <p v-if="!replyList.length" class="wpct100 ptb40 fs14 text-center" style="color:#999">暂无留言 ~</p>
      <BaseMessage
        v-for="item in replyList"
        :key="item.id"
        :id="item.userId"
        :replyid="item.id"
        :userDelID ="authCenterUserId"
        :isDelete="item.isDelete"
        :img="item.avatar || require('@/assets/images/defaultLogo.png')"
        :name="item.sendUserName"
        :value="item.content"
        :time="showRecentTime(item.createTimestamp)"
        @reply="onReply($event)"
        @delete="deleteReply($event)"
        :isMy="item.del"
        :replyList="item.children"
      />
      <!--  -->
    </div>
    <!-- 添加回复 -->
    <div style="    position: fixed;
    bottom: 0px;
    width: 100%;
    left: 0;">
      <van-cell-group>
        <van-field v-model="msg" center clearable :placeholder="`添加回复:${ReplyMsg}`" ref="Reply">
          <van-button slot="button" size="small" type="primary" @click="submitReply">确定</van-button>
        </van-field>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import {
  msgDetail,
  replyList as getReplyList,
  msgDelete,
  replyAdd,
  replyDelete,
  wxMsgDetail
} from "@/api/message";
import { currentUser, currentUserByUserId, getCurrentUser, getSupInfoByUserId} from "@/api/user";
import { savePosition } from "@/mixins";
import { isEmpty, showRecentTime, deepClone } from "@/utils";
import { apiAgent ,clientApiAgent} from "@/config";
import AttaItem from "@/components/AttachmentItem";

import BaseMessage from "@/components/BaseMessage";
import BaseDefaultNull from "@/components/BaseDefaultNull";

export default {
  name: "PurchaseDetails",
  components: { BaseMessage, AttaItem ,BaseDefaultNull},
  data() {
    return {
      wxUserCache: {},
      message: {},
      replyList: [
      ],
      replyFloor: {},
      sms: "",
      loading: false,
      showMsgInputIndex: "", // 当前选中的回复的 index
      showReplyInput: false,
      msg: "",
      info: {},
      attaList: [],
      Replyid: "",
      ReplyMsg: "",
      defaultLogo: require("@/assets/images/defaultLogo.png"),
      authCenterUserId:'',
      isWxMin: false,
      isPurchase: false
    };
  },
  computed: {},
  async created() {
   
    this.isWxMin = this.$route.query.type == 'wx_min'
    this.isPurchase = this.$route.query.type == 'purchase'

    this.$toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true
    });
    await this.fetchCurrentUsers()

    if(this.isPurchase){
      document.title = '采购需求详情'
    }else{
      document.title = '消息详情'
    }
    // console.log(this.$route.query.type );
    if(this.isWxMin){
      document.title = '供应商留言详情'
      await this.wxMinfetchMsgDetailData()
    }else{
      await this.fetchMsgDetailData();
    }
    this.fetchReplyListData();
  },

  computed: {
    canSumbit() {
      return isEmpty(this.sms);
    }
  },
  methods: {
     deleteMessage(msgId) {
      this.$dialog
        .confirm({
          title: "确认删除?",
          message: "您确认删除本条回复吗"
        })
        .then(() => {
          // on confirm
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            overlay: true,
            forbidClick: true,
            message: "正在删除"
          });
          msgDelete(msgId)
            .then(res => {
              this.$toast.success("删除成功");
              this.$route.go(-1)
            })
            .finally(() => {
              this.$toast.clear();
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    fetchCurrentUsers(){
      getCurrentUser().then(res=>{
        this.authCenterUserId = res.authCenterUserId
      })
    },
    showRecentTime,
    // 获取本条消息
    fetchMsgDetailData() {
      return msgDetail(this.$route.query.msgId)
        .then(async res => {
          // 获取缓存,如果没有去拿用户缓存的接口
          if (this.wxUserCache[res.userId]) {
            res.avatar = this.wxUserCache[res.userId].avatar;
            res.sendUserName = this.wxUserCache[res.userId].name;
          } else {
            await currentUserByUserId(res.userId).then(wxUser => {
              this.wxUserCache[res.userId] = wxUser;
              res.avatar = wxUser.avatar;
              res.sendUserName = wxUser.name;
            });
          }
          this.message = res;
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    wxMinfetchMsgDetailData() {
      return wxMsgDetail(this.$route.query.msgId)
        .then(async res => {
          // 获取缓存,如果没有去拿用户缓存的接口
          if (this.wxUserCache[res.userId]) {
            res.avatar = this.wxUserCache[res.userId].avatar;
            res.sendUserName = this.wxUserCache[res.userId].name;
          } else {
            await getSupInfoByUserId(res.userId).then(wxUser => {
              this.wxUserCache[res.userId] = wxUser;
              res.avatar = wxUser.avatar;
              res.sendUserName = wxUser.name;
            });
          }
          this.message = res;
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    // 获取回复列表
    fetchReplyListData() {
      console.log(this.message.id);
      return getReplyList(this.message.id).then(async res => {
        let sonList = [];
        let parentList = [];
        //  分级
        for( let item of res){
          if (this.wxUserCache[item.userId]) {
            this.isWxUserCache(item);
          } else {
            await currentUserByUserId(item.userId).then(wxUser => {
              this.wxUserCache[item.userId] = wxUser;
              item.avatar = wxUser.avatar;
              item.sendUserName = wxUser.name;
            });
          }
        }
        res.forEach((item, index) => {
          item.replyId == null || item.replyId == 0 ? parentList.push(item) : sonList.push(item)
        });	
        //  循环一层
        parentList.forEach(item => {
          item.children = []
          this.purchaseFilter(item)
          sonList.forEach((arr)=>{
            if(item.id == arr.replyId){
              item.children.push(arr)
              // 如果有循环子回复
              this.isReplyIdNextId(arr,sonList,item)
            }
          })
        });
       this.replyList = parentList
      });
    },
    isReplyIdNextId (item,sonList,parent) {
      sonList.forEach((arr)=>{
        this.purchaseFilter(arr)
        if(item.id == arr.replyId){
          parent.children.push(arr)
          this.isReplyIdNextId(arr,sonList,parent)
        }
      })
    },
    isWxUserCache(item){
      item.avatar = this.wxUserCache[item.userId].avatar;
      item.sendUserName = this.wxUserCache[item.userId].name;
      return item;
    },
    purchaseFilter(item){
      if(this.isWxMin && this.message.userId != item.userId){
        item.avatar = this.defaultLogo
        item.sendUserName = "众上"
      }
      return item;
    },
    deleteReply(replyId) {
      this.$dialog
        .confirm({
          title: "确认删除?",
          message: "您确认删除本条回复吗"
        })
        .then(() => {
          // on confirm
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            overlay: true,
            forbidClick: true,
            message: "正在删除"
          });
          replyDelete(replyId)
            .then(res => {
              this.$toast.success("删除成功");
              this.fetchReplyListData();
            })
            .finally(() => {
              this.$toast.clear();
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    sendReply(replyId) {
      if(this.msg == ''){
        return this.$toast("输入内容不能为空")
      }
      this.$dialog
        .confirm({
          title: "确认提交回复?",
          message: "您确认提交本条回复吗"
        })
        .then(() => {
          // on confirm
          replyAdd({
            sysTag: this.isWxMin ?  clientApiAgent :  apiAgent,
            msgId: this.message.id,
            content: this.msg,
            replyId: replyId
          })
            .then(res => {
              this.msg = "";
              this.Replyid = "";
              this.ReplyMsg = "";
              this.$toast.success("回复成功");
              this.fetchReplyListData();
            })
            .finally(() => {
              this.Replyid = "";
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    submitReply() {
      this.showReplyInput = false;
      this.sendReply(this.Replyid); // 发送消息
    },
    // 点击回复,或者 直接回复自己
    onReply(item) {
      this.showReplyInput = true;
      this.$refs.Reply.focus();
      this.Replyid = item.id; // 存入 回复id
      this.ReplyMsg = item.msg;
    },
    showRecentTime
  }
};
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.caseTitle {
  width: 90%;
  margin: 0 auto;
  margin-top: 3%;
  font-size: 20px;
  font-weight: 600;
  color: rgba(57, 60, 65, 1);
  line-height: 28px;
  p {
    margin: 0;
    padding: 0;
  }
  p:nth-child(2) {
    font-size: 14px;
    font-weight: 500;
    margin-top: 14px;
    color: rgba(149, 156, 167, 1);
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
.onepx_border_bottom {
  border-bottom: 1px solid rgba(244, 244, 244, 1);
}
</style>
