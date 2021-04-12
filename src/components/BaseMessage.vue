<template>
  <div class="row mt20 onepx_border_bottom pb26">
    <div class="w52 h52">
      <img :src="img" class="w52 h52" style="border-radius:50%" alt />
    </div>
    <div class="flex-1 ml12">
      <p>{{ name }}</p>
      <del v-if="isDelete" class="fs14" style="color:#999">已删除</del>
      <p v-else class="fs15 mt8" style="color:#262626;  word-wrap: break-word;word-break: break-all;">{{  value }}</p>
      <div class="wpct100 row space-between mt14">
        <span class="fs13" style="color:#AFAFAF">{{ time }}</span>
        <div>
          <span
            v-if="!isDelete"
            class="fs12 ptb2 pl12 pr12"
            style="color:#5B6A91;background:#eeeeee;border-radius:12px"
            @click="onReply(replyid,value)"
          >回复</span>
          <img
            :src="require('@/assets/images/msg/mess_icon_del@2x.png')"
            class="w20 ml14"
            v-if="userDelID == id && !isDelete"
            alt
            @click="deleteMsg(replyid)"
          />
        </div>
      </div>
      <!-- 回复盒子 -->
      <div class="p14 mt12" style="background:#f9f9f9" v-for="(item,index) in replyList" :key="index">
        <div class="fs14">
          <div>
            <span style="color:#5B6A91" class="mr8">{{ item.sendUserName }}:</span>
            <del v-if="item.isDelete" class="fs14" style="color:#999">已删除</del>
            <span v-else style="  word-wrap: break-word;
        word-break: break-all;">{{ item.content }}</span>
          </div>
          <div class="row space-between mt12 center-y">
            <span class="fs13" style="color:#AFAFAF">{{ showRecentTime(item.createTimestamp) }}</span>
            <div>
              <span
                v-if="!item.isDelete"
                class="fs12 ptb2 pl12 pr12"
                style="color:#5B6A91;background:#eeeeee;border-radius:12px"
                @click="onReply(item.id,item.content)"
              >回复</span>
              <img
                :src="require('@/assets/images/msg/mess_icon_del@2x.png')"
                class="w20 ml14"
                v-if="userDelID == item.userId && !item.isDelete"
                alt
                @click="deleteMsg(item.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, showRecentTime } from '@/utils'

export default {
  name: "BaseTitle",
  props: {
    id: {
      //
      type: String
    },
    img: {
      //
      type: String
    },
    name: {
      //
      type: String
    },
    value: {
      //
      type: String
    },
    time: {
      //
      type: String
    },
    replyList: {
      type: Array,
      default: () => {
      }
    },
    isMy: {
      type: Boolean
    },
    isDelete: {
      type: Boolean
    },
    userDelID:{
      type: String
    },
    replyid:{
      type: String
    }
    
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    showRecentTime,
    onReply(id, msg) {
      this.$emit("reply", {
        id: id,
        msg: msg
      });
    },
    deleteMsg(id) {
      this.$emit("delete", id);
    }
  },
  watch: {
    replyList:function(val){
      console.log(val);
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
