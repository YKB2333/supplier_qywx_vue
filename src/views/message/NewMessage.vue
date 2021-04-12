<template>
  <section class="page">
    <!--  -->
    <van-cell-group style="width:92%;margin:0 auto;">
      <van-field
        v-model="message.username"
        label="接收人"
        size="large"
        input-align="right"
        label-class="messagefield"
        style="padding: 14px 0 14px 0 !important;"
        :readonly="true"
        @click="selectReceiveUsers"
        v-if="!purchaseFlag"
      >
        <div slot="right-icon" class="messageIcon">
          &nbsp;
          <img
            :src="require('@/assets/images/msg/mess_icon_per@2x.png')"
            style="width:22px"
          />
        </div>
      </van-field>
      <van-field
        v-model="message.title"
        :label="purchaseFlag?'标题':'主题'"
        size="large"
        placeholder="请输入"
        input-align="right"
        label-class="messagefield"
        style="padding: 14px  0 14px 0!important;"
        @click-right-icon="$toast('question')"
      />
      <van-field
        v-model="message.content"
        rows="1"
        type="textarea"
        style="padding: 14px  0 14px 0!important;"
        label-class="leaveMessage"
        :autosize="{ minHeight: 100 }"
        :placeholder="purchaseFlag?'请输入需求内容':'请输入留言内容'"
      />
    </van-cell-group>
    <div class="wpct92 mauto h52 l-h52  " style="border-top:1px solid rgba(244,244,244,1);border-bottom:1px solid rgba(244,244,244,1)">
      <van-uploader :after-read="afterRead" accept="*"  class="row  wpct100 mauto">
        <img :src="require('@/assets/images/msg/need_icon_file@2x.png')" class="w22 " alt="">
        <span class="ml6 fs15" style="color:#282828">附件</span>
        <img :src="require('@/assets/images/msg/icon_add.png')" class="w22 " alt=""  style="position: absolute;right: 0;top: 50%;transform: translate(0,-50%);">
      </van-uploader>
    </div>
    <div>
      <atta-item 
        parent_Class="mb2 p2 wpct92 mauto"
        parent_Style="box-shadow:node"
        v-for="(item, index) in attrlist" :key="index"
        :file-name="item.file.name"
        :file-type="item.file.type"
        :size="item.file.size"
        :attaId="index"
        delectAttr="true"
        @Delle="onDelleAttr($event)"
      />
    </div>

    <div class="MessageBtn mt30">
      <span
        style="background:rgba(238,238,238,1);color: #AFAFAF;"
        @click="$router.go(-1)"
      >取消</span>
      <span
        v-if="canSubmit == true"
        style="background:rgba(238,238,238,1);color: #AFAFAF;"
      >发送</span>
      <span v-else @click="save">发送</span>
    </div>
  </section>
</template>

<script>
import { msgAdd } from '@/api/message'
import { uploadSupplierAtta } from '@/api/supplier'
import { savePosition } from '@/mixins'
import { isEmpty } from '@/utils'
import { Toast } from 'vant'
import { apiAgent } from '@/config'
import AttaItem from '@/components/AttachmentItem'

export default {
  name: 'NewMessage',
  components: {AttaItem},
  mixins: [new savePosition()],
  data() {
    return {
      message: {
        msgType:'1', // 1发送, 2通知, 3采购
        targetUserId: [], //接收人
        username: '', //接收人
        title: '', // 主题
        content: '', // 留言
        attachments:[]
      },
      purchaseFlag:false, // 采购需求判断
      attrlist:[] ,
      uploadAttaForm: {
        filePath: "",
        fileName: "",
        fileType: "",
        type: "",
        size: 0,
      },
    }
  },
  created() {
    this.isType()

    if(this.$route.query.type == 'purchase'){
      document.title = '发起采购需求'
    }
  },
  mounted() {},
  computed: {
    canSubmit() {
    if(this.$route.query.type == 'purchase'){
      return ( this.message.title) || isEmpty(this.message.content)
    }
    return (
      isEmpty(this.message.title) ||
      isEmpty(this.message.content) ||
      isEmpty(this.message.targetUserId)
    )
    },
  },
  methods: {
    // 如果是采购需求消息进入de msgtype 为3
    isType(){
      if(this.$route.query.type == 'purchase'){
        this.message.msgType = '3'
        this.purchaseFlag = true
      }
    },
    onDelleAttr(index){
      this.$dialog.confirm({
        title: '确认删除',
        message: '确认删除附件吗?'
      }).then(() => {
        this.attrlist.splice(index,1)
        this.message.attachments.splice(index,1)

      }).catch(() => {
        // on cancel
      })
    },
    afterRead(file) {
      this.$toast.loading({
        duration: 0,
        message: "上传中...",
        forbidClick: true
      });
      // 此时可以自行将文件上传至服务器
      let formData = new FormData();
      formData.append("file", file.file);
      uploadSupplierAtta(formData)
        .then(res => {
          this.$toast.clear();
          console.log(res,'上传成功');
          this.attrlist.push(file)
          let uploadAttaForm = {};
          uploadAttaForm["filePath"] = res.url
          uploadAttaForm["fileName"] = res.fileName
          uploadAttaForm["size"] = res.size
          uploadAttaForm["fileType"] = res.fileType
          this.message.attachments.push(uploadAttaForm)
        })
        .catch(errer => {
          this.$toast.clear();
          console.log(error);
        });
    },
    save() {
      // 如果是采购进入的purchaseFlag为true, 采购需要接受人
      if (isEmpty(this.message.targetUserId) && this.purchaseFlag == false ) {
        Toast('请选择接收人')
        return
      }
      if (isEmpty(this.message.title)) {
        this.purchaseFlag?Toast('请填写标题') : Toast('请填写主题')
        return
      }
      if (isEmpty(this.message.content)) {
        this.purchaseFlag?Toast('请填写需求内容') : Toast('请填写留言内容')
        return
      }
      if(this.purchaseFlag){
        delete this.message.targetUserId
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        overlay: true,
        forbidClick: true,
        message: '正在提交'
      })

      this.message['sysTag'] = apiAgent
      msgAdd(this.message)
        .then(res => {
          // 采购
          if(this.purchaseFlag){
            Toast('采购需求发送成功')
            this.$store.commit('REMOVE_CACHE_PAGE', 'MyMessage')
            this.$router.push({ path: '/PurchaseMessage' })
            return
          }
          // 消息
          Toast('留言发送成功')
          this.$store.commit('REMOVE_CACHE_PAGE', 'MyMessage')
          this.$router.push({ path: '/mymessage' })
        })
        .finally(() => {
          this.$toast.clear()
        })
    }, // 选择汇报人
    selectReceiveUsers() {
      // console.info('选择汇报人')
      wx.invoke(
        'selectEnterpriseContact',
        {
          fromDepartmentId: -1, // 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
          mode: 'multi', // 必填，选择模式，single表示单选，multi表示多选
          type: ['department', 'user'], // 必填，选择限制类型，指定department、user中的一个或者多个
          selectedUserIds: this.message.targetUserId // 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
        },
        res => {
          if (res.err_msg == 'selectEnterpriseContact:ok') {
            if (typeof res.result == 'string') {
              res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }
            this.message.targetUserId = res.result.userList.map(item => item.id)
            let usernameList = res.result.userList.map(item => item.name)

            if (this.message.targetUserId.length > 3) {
              this.message.username =
                usernameList.slice(0, 3).join('、') +
                `共${usernameList.length}人`
            } else {
              this.message.username = usernameList.join('、')
            }

            // this.message.content = JSON.stringify(this.message)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.messageIcon {
  position: relative;
}
[class*='van-hairline']::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border: 0 solid #ffffff;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
.van-cell:not(:last-child)::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 0px;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.messagefield {
  font-size: 16px;
  color: rgba(57, 60, 65, 1);
}
.leaveMessage {
  font-size: 15px;
  color: #959ca7;
}
.page {
  height: 100vh;
  overflow-y: scroll;
  background: white;
}
.NewMessage {
  width: 90%;
  margin: 0 auto;
}
.NewMessage-row {
  display: flex;
  height: 52px;
  line-height: 52px;
  width: 90%;
  margin: 0 auto;
  justify-content: flex-start;
  align-items: center;
  // background:rgba(255,255,255,1);
  // border-bottom: 1px solid rgb(244, 244, 244);
  border-bottom: 1px solid redmar;

  input {
    border: none;
    outline: none;
  }
  img {
    width: 24px;
    height: 24px;
  }
}
.MessageBtn {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
    color:white;
    width: 47%;
    line-height: 45px;
    height: 45px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 3px;
    background: #57B4B4;
  }
}
/deep/ .van-uploader__wrapper{
  width: 100% !important;
}
/deep/ .van-uploader__input-wrapper{
  width: 100% !important;
}
</style>