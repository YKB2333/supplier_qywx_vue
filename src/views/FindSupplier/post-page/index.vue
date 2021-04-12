<template>
  <div class="page">
    <div>
      <van-field v-model="content" placeholder="请输入内容，最长500个字符" maxlength="500" type="textarea" rows="6" show-word-limit />
    </div>
    <div class="bg-white">
      <div class="van-hairline--top-bottom ptb10 mlr14">
        <div class="row">
          <div class="flex-1 text-center van-hairline--right" @click="changeFileType('1')">
            <img :src="fileType === '1' ? require('@/assets/images/detail_icon_vedio_pre.png') : require('@/assets/images/detail_icon_vedio_pre_disable.png')" width="33">
            <span class="fs14" :class="fileType === '1' ? 'color666' : 'color999'">图片</span>
          </div>
          <div class="flex-1 text-center" @click="changeFileType('2')">
            <img :src="fileType === '2' ? require('@/assets/images/detail_icon_vedio.png') : require('@/assets/images/detail_icon_vedio_disable.png')" width="33">
            <span class="fs14" :class="fileType === '1' ? 'color999' : 'color666'">视频</span>
          </div>
        </div>
      </div>
    </div>
    <div class="ptb20 mb10 plr14 bg-white">
      <div class="fs12 red-light mb4" style="transform: scale(.8); margin-left: -11%;">*图片及视频仅支持选择其中一种</div>
      <div v-show="fileType === '1'">
        <van-uploader 
          v-model="imgList"
          :accept="accept"
          :after-read="afterRead"
          :before-read="beforeRead"
          :multiple="multiple"
          :max-count="maxCount"
          preview-size="100px"
          @delete="onDelete"
        />
      </div>
      <div v-show="fileType === '2'">
        <div v-if="!showVideo">
          <van-uploader 
            v-model="videoList"
            :accept="accept"
            :after-read="afterRead"
            :before-read="beforeRead"
            :multiple="multiple"
            :max-count="maxCount"
            max-size="52428800"
            preview-size="100px"
          />
        </div>
        <!-- 上传视频后预览 -->
        <div v-if="showVideo" class="relative" style="z-index:0;">
          <div>
            <video-player 
              :playsinline="true"
              :options="playerOptions"
              v-if="!isShowVideo"
            />
            <img v-if="isShowVideo" class="w-full h192" :src="playerOptions.poster">
          </div>
          <!-- <img :src="require('@/assets/images/post/detail_icon_dele.png')" class="video-dele-btn" @click="onDelVideo"> -->
          <div @click="onDelVideo" class="video-dele-btn mt10">删除</div>
        </div>
      </div>
      
    </div>
    <!-- 选择标签 -->
    <div class="ptb20 bg-white plr16">
      <div class="fs16 fw600">选择标签</div>
      <!-- 新增 -->
      <div class="row wrap" :class="{'height-active': isShowMore}">
        <div
          class="plr10 mt14 tag"
          :class="{'active': tagActiveList.includes(item.id)}"
          v-for="(item, idx) in customTag"
          :key="idx"
          @click="onSelectTag(item.id, item.name)"
        >
          #{{item.name}}
          <img
            v-if="item.id !== '0' && item.id !== '1'"
            :src="tagActiveList.includes(item.id) ? require('@/assets/images/post/icon_gb_p.png') : require('@/assets/images/post/icon_gb.png')"
            class="w-h10"
            @click.stop="onDelTag(item.id, idx)"
          />
        </div>
        <div class="plr10 mt14 tag">
          <van-field
            class="add-tag-text"
            v-model="tagText"
            placeholder="#请输入内容"
            @blur="onAddTag"
            maxlength="8"
          />
        </div>
      </div>
      <div class="row center h22 mt20">
        <img
          :src="require('@/assets/images/post/icon_more.png')"
          :class="{'w-h22': true, 'rotate180': !isShowMore}"
          @click="onChangeHeight"
        />
      </div>
    </div>
    <div class="mlr16 mb20">
      <button :class="['post-btn', isLoading ? 'post-btn-opacity' : '']" @click="onPost" :disabled="isLoading">{{ isLoading ? '文件上传中' : '发布' }}
      </button>
    </div>
  </div>
</template>

<script>
import { addPostInfo, getAllTag, saveTag, deleteTag } from '@/api/supplier'
import { uploadSupInfoImage, uploadSupInfoVideo } from '@/api'
import { isMobile } from "@/utils"

export default {
  name: 'PostPage',
  computed: {
    multiple() {
      if (this.fileType === '1') return true
      return false
    },

    maxSize() {
      if (this.fileType === '1') {
        return 2 * 1024 * 1024 // 2M
      } else if (this.fileType === '2') {
        return 50 * 1024 * 1024 // 10M
      }
    },

    maxCount() {
      if (this.fileType === '1') {
        return 9
      } else if (this.fileType === '2') {
        return 1
      }
    },

    showVideo() {
      if (this.fileType === '2' && !this.isLoading && this.videoList.length) {
        let video = this.videoList[0]
        this.playerOptions['sources'] = [{
          src: video.url,
          // type: `video/${video.fileType}`,
          type: 'video/mp4'
        }]
        return true
      }
      return false
    },

    accept() {
      if (this.fileType === '1') {
        return this.imgTypes.join(',')
      }
      if (this.fileType === '2') {
        return this.videoTypes.join(',')
      }
    }
  },
  data() {
    return {
      content: '',
      fileType: '1',
      customTag: [],
      imgList: [],
      imgUpLoadList: [],
      videoList: [],
      videoUpLoadList: [],
      tagActiveList: [],
      tag: [],
      videoTypes: ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov', 'video/mkv', 'video/mod', 'video/3gpp', 'video/quicktime'],
      imgTypes: ['image/png', 'image/jpeg', 'image/jpg'],
      tagText: '',
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
          fullscreenToggle: true,
        },
      },
      postInfo: {
        cmsInfoAttas: [
          {
            attaType: '1',
            attaUrl: '',
          },
        ],
        content: '',
        tagList: [''],
      },
      isLoading: false,
      isShowMore: true,
      isShowVideo: false
    }
  },

  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchAllTag()
    },
    //获取所有标签
    fetchAllTag() {
      getAllTag().then((res) => {
        this.customTag = [
          { id: '0', name: '卖场情报', type: '1' },
          { id: '1', name: '产品特写', type: '1' }
        ]
        this.customTag = this.customTag.concat(res)
      })
    },

    async afterRead(data) {
      // 多选时data是一个数组，单选为一个对象
      try {
        this.isLoading = true
        this.$store.commit('SHOW_LOADING', '上传中')
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            await this.uploadHttp(data[i].file)
          }
        } else {
          await this.uploadHttp(data.file)
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    // 上传前校验
    beforeRead(data) {
      if (Array.isArray(data)) {
        let typeArr = data.map((item) => item.type)
        if (this.fileType === '1') {
          let isType = typeArr.every((type) => this.imgTypes.includes(type))
          if (!isType) {
            this.$toast('图片格式不正确')
            return false
          }
        }
        if (this.fileType === '2') {
          let isType = typeArr.every((type) => this.videoTypes.includes(type))
          if (!isType) {
            this.$toast(`视频格式不正确${data.type}`)
            return false
          }
        }
      } else {
        if (this.fileType === '1') {
          let isType = this.imgTypes.includes(data.type)
          if (!isType) {
            this.$toast('图片格式不正确')
            return false
          }
        }
        if (this.fileType === '2') {
          let isType = this.videoTypes.includes(data.type)
          if (!isType) {
            this.$toast(`视频格式不正确${data.type}`)
            return false
          }
          if(data.size > 52428800) {
            this.$toast(`视频大小超过50M`)
            return false
          }
          if(!isMobile() && data.type === 'video/mov') {
            this.$toast(`视频格式只支持MP4`)
          }
        }
      }
      return true
    },

    uploadHttp(file) {
      let method = this.fileType === '1' ? uploadSupInfoImage : uploadSupInfoVideo
      return new Promise((resolve, reject) => {
        method(file).then(async res => {
          if(this.fileType === '1') {
            let arr = this.imgUpLoadList.filter(item => item.url)
            this.imgUpLoadList = [...arr, res]
          }
          if(this.fileType === '2') {
            this.videoUpLoadList = [res]
            this.playerOptions.poster = res.snapshot
            this.videoList = this.videoUpLoadList
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    changeFileType(type) {
      if (type !== this.fileType) {
        this.fileType = type
      } 
    },
    //增加标签
    onAddTag() {
      if (this.tagText.trim()) {
        saveTag([this.tagText]).then((res) => {
          this.customTag.push({ name: this.tagText })
          this.tagText = ''
          this.fetchAllTag()
        })
      }
    },
    //删除标签
    onDelTag(id) {
      this.$dialog.confirm({
        message: '确定删除标签吗',
      }).then((res) => {
        deleteTag(id).then((res) => {
          this.$toast('删除成功')
          this.fetchAllTag()
        })
      })
    },
    //选择标签
    onSelectTag(id, text) {
      if (this.tagActiveList.includes(id)) {
        this.tagActiveList.splice(this.tagActiveList.indexOf(id), 1)
        this.tag.splice(this.tag.indexOf(text), 1)
      } else {
        this.tagActiveList.push(id)
        this.tag.push(text)
      }
    },

    onDelete(e) {
      if(this.fileType === '1') {
        this.imgUpLoadList = this.imgUpLoadList.filter(item => item.fileName !== e.file.name )
      }
    },

    //发布
    onPost() {
      if (this.content.trim() === '') {
        this.$toast('资讯内容不能为空')
        return
      }
      if(this.fileType === '2') {
        this.isShowVideo = true
      }
      this.$dialog.confirm({
        message: '确定发布此资讯吗?'
      }).then(res => {
        this.$store.commit('SHOW_LOADING')
        let cmsInfoAttas = []
        let resList = this.fileType === '1' ? this.imgUpLoadList : this.videoUpLoadList
        resList.map(item => {
          cmsInfoAttas.push({
            attaType: this.fileType,
            attaUrl: item.url,
            fileName: item.fileName,
            fileType: item.fileType,
            size: item.size,
          })
          if(this.fileType === '2'){
            cmsInfoAttas[0].snapshot = item.snapshot
          }
        })
        this.postInfo = {
          cmsInfoAttas,
          content: this.content,
          tagList: this.tag,
        }
        addPostInfo(this.postInfo).then(async () => {
          await this.$toast('发布成功')
          setTimeout(() => {
            this.$toast.clear()
            this.$router.go(-1)
          }, 1000)
        }).finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
      }).catch(err => {
        this.isShowVideo = false
      })
    },

    onChangeHeight() {
      this.isShowMore = !this.isShowMore
    },

    onDelVideo() {
      this.videoList = []
      this.videoUploadList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f9f9f9;
  .poster-img {
    max-width: 100%;
    max-height: 100%;
  }
  .height-active {
    max-height: 120px;
    overflow: hidden;
  }
  .rotate180 {
    transform: rotate(180deg);
  }
  .tag {
    line-height: 24px;
    margin-right: 16px;
    font-size: 14px;
    border: 1px solid #afafaf;
    border-radius: 12px;
    color: #707070;
    &.active{
      border: 1px solid transparent;
      background-color: rgba(87, 180, 180, 0.1);
      color: #57b4b4;
    }
  }
  .add-tag-text {
    // display: inline-block;
    width: 80px;
    padding: 0;
    border: none;
  }
  .post-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 30px;
    text-align: center;
    border: none;
    border-radius: 20px;
    color: white;
    background: #57b4b4;
  }
  .post-btn-opacity{
    opacity: .5;
  }
}
.color666{
  color: #262626;
}
.color999{
  color: #AFAFAF;
}
.save-btn {
  display: flex;
  /deep/ .van-button {
    height: 38px;
    line-height: 36px;
    &.delete-btn {
      color: #999;
      border-color: #ccc;
      background-color: #fff;
      width: 100px;
      margin-right: 10px;
    }
  }
}
/deep/ .van-uploader{
  width: 100%;
  .van-uploader__wrapper{
    justify-content: space-between;
    &::after{
      content: "";
      width: 32%;
    }
  }
  .van-uploader__preview{
    width: 32%;
    margin-right: 0;
    .van-uploader__preview-image, .van-uploader__file{
      width: 100% !important;
      height: 109px !important;
    }
  }
  .van-uploader__upload{
    width: 32% !important;
    height: 109px !important;
  }
}
/deep/ .van-uploader__preview-image{
  border-radius: 0 !important;
}
/deep/ .van-uploader__preview-delete {
  top: 0px;
  right: 0px;
  background-image: url('~@/assets/images/post/detail_icon_dele.png');
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: unset;
  background-size: 100%;
  &::before {
    content: '';
  }
  .van-uploader__preview-delete-icon{
    display: none;
  }
}
/deep/ .van-uploader__upload{
  margin-right: 0;
  background-color: #f2f4f9;
  border: none;
  border-radius: 0;
  .van-uploader__upload-icon {
    background-image: url('~@/assets/images/post/icon_add.png');
    width: 33px;
    height: 33px;
    background-repeat: no-repeat;
    background-position: center;
    &::before {
      content: '';
    }
  }
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
/deep/ .van-loading{
  display: inline-block;
  width: 20px;
}
.video-dele-btn{
  // position: absolute;
  // width: 30px;
  // height: 30px;
  // top: 0;
  // right: 0;
  // z-index: 1;
  font-size: 12px;
  text-align: right;
  z-index: 1;
  color: #57b4b4;
}
</style>
