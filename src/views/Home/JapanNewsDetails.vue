<template>
  <div id="page">
    <div class="caseTitle" v-if="info.title">
      <p class="ellipsis2">{{info.title}}</p>
      <p v-if="showDate">
        <span class="mr10" style="color:#5B6A91;">{{info.source}}</span>
        {{showCreateTime(info.createTimestamp)}}
      </p>
    </div>
    <div class="richText" v-html="info.content" @click="imageChange"></div>
    <!-- 资讯附件列表 -->
    <div v-if="attaList.length">
      <div v-if="info.type === '1'" class="plr14 pb2">
        <div v-for="(item, index) in attaList" :key="index">
          <img
            v-if="item.attaType === '1'"
            class="mb10"
            style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
            :src="item.attaUrl"
          />
          <video-player v-if="item.attaType === '2'" :playsinline="true" :options="playerOptions" />
        </div>
      </div>
      <!-- 资讯附件列表 -->
      <div v-if="info.type === '2'" class="plr14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in attaList"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaUrl="item.attaUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getJapanInfoOne, getAttaById } from '@/api/cmsInfo'
import { isEmpty, showRecentTime, showCreateTime, isMobile } from '@/utils'
import AttaItem from '@/components/AttachmentItem'
import { ImagePreview } from 'vant'

export default {
  name: 'JapanNewsDetails',
  components: { AttaItem },
  data() {
    return {
      info: {},
      attaList: [],
      showDate: true,
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 是否静音
        muted: false,
        // 视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        // sources: [{ type: 'video/mp4', src: 'http://zs-oa.oss-cn-shenzhen.aliyuncs.com/zsoa/supplier/atta/2020/01/08/10cbcf40-4c59-44b7-94d3-478bbbdc3cf2.mp4' }],
        sources: [],
        //你的封面地址
        poster: '',
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      }
    }
  },
  computed: {
    videoPosterUrl() {
      return (this.playerOptions.poster = res.snapshot)
    }
  },
  created() {
    if (this.$route.query.showDate !== undefined) {
      this.showDate = this.$route.query.showDate
    }
    let documentTitle = this.$route.query.title
    if (documentTitle) {
      document.title = documentTitle
    }
    this.$toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true
    })
    this.fetchCmsInfoData()
    //this.fetchCmsInfoAtta()
  },
  methods: {
    showCreateTime,
    showRecentTime,
    fetchCmsInfoData() {
      return getJapanInfoOne(this.$route.query.id).then((res) => {
        this.info = res
        this.attaList = res.cmsInfoAttas
        let videoObj = this.attaList.filter((v) => v.attaType === '2')[0]
        if (videoObj) {
          this.playerOptions.poster = videoObj.snapshot
          this.playerOptions['sources'] = [
            {
              src: videoObj.attaUrl,
              // type: `video/${video.fileType}`,
              type: 'video/mp4'
            }
          ]
        }
        this.$toast.clear()
      })
    },
    // fetchCmsInfoAtta() {
    //   return getAttaById(this.$route.query.id).then(res => {
    //     this.attaList = res
    //   })
    // },
    //富文本图片点击放大
    imageChange(e) {
      // console.log(e.target)
      if (e.target.tagName == 'IMG') {
        if (isMobile()) {
          // 移动端使用微信接口
          wx.previewImage({
            urls: [e.target.src] // 需要预览的图片http链接列表
          })
        } else {
          ImagePreview({
            images: [e.target.src],
            className: 'imagePreviewEle'
          })
        }
      }
    }
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
    margin-top: 14px;
    color: rgba(149, 156, 167, 1);
  }
}
.richText {
  overflow: hidden;
  width: 90%;
  white-space: pre-line;
  margin: 19px auto;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
/deep/ .video-js .vjs-big-play-button {
  background: url('~@/assets/images/detail_icon_play.png') no-repeat center;
  background-size: 100%;
  height: 45px;
  width: 45px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: none;
  .vjs-icon-placeholder {
    &::before {
      content: '';
    }
  }
  .vjs-tech {
    border-radius: 5px;
  }
}
</style>
