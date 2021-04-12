<template>
  <div id="page">
    <div class="caseTitle" v-if="info.title">
      <p>{{info.title}}</p>
      <p v-if="showDate">
        <span class="mr10" style='color:#5B6A91;'>{{info.source}}</span>{{showCreateTime(info.createTimestamp)}}
      </p>
    </div>
    <div class="richText" v-html="info.content" @click="imageChange"></div>

    <!-- 资讯附件列表 -->
    <div v-if="attaList.length" class="plr14 pb2">
      <atta-item 
        style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
        v-for="(item, index) in attaList" :key="index"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaUrl="item.attaUrl"
      />
    </div>

  </div>
</template>

<script>
import { getOne, getAttaById } from '@/api/cmsInfo'
import { isEmpty, showRecentTime, showCreateTime, isMobile } from '@/utils'
import AttaItem from '@/components/AttachmentItem'
import { ImagePreview } from 'vant'

export default {
  name: 'NewsDetails',
  components: { AttaItem },
  data() {
    return {
      info: {},
      attaList: [],
      showDate: true,
    }
  },
  computed: {},
  created() {
    if(this.$route.query.showDate !== undefined){
      this.showDate = this.$route.query.showDate
    }
    let documentTitle = this.$route.query.title
    if(documentTitle){
      document.title = documentTitle
    }
    this.$toast.loading({duration: 0,message: "加载中...",forbidClick: true});
    this.fetchCmsInfoData();
    this.fetchCmsInfoAtta()
  },
  methods: {
    showCreateTime,
    showRecentTime,
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res
        this.$toast.clear();
      })
    },
    fetchCmsInfoAtta() {
      return getAttaById(this.$route.query.id).then(res => {
        this.attaList = res
      })
    },
    //富文本图片点击放大
    imageChange(e) {
      // console.log(e.target)
      if (e.target.tagName == 'IMG') {
        if (isMobile()) {
        // 移动端使用微信接口
          wx.previewImage({
            urls: [e.target.src] // 需要预览的图片http链接列表
          })
        }else {
          ImagePreview({
            images: [e.target.src],
            className: 'imagePreviewEle'
          })
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#page {
  min-height: 100vh;
  background: white;
  overflow-y: auto;
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
    margin-top:14px;
    color: rgba(149, 156, 167, 1);
  }
}
.richText {
  overflow: hidden;
  width: 90%;
  white-space: pre-line;
  margin: 0 auto;
  margin-top: 19px;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}

</style>
