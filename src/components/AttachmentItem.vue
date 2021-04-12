<template>
  <div :class="['attachment-item',parent_Class]" :style="parent_Style"  @click="onDownload">
    <img :src="fileTypeImage(fileType)" width="40" height="40" />
    <div class="content-box ">
      <p class="file-name ellipsis mt2">{{ fileName }}</p>
      <div class="bottom ">
        <div class="fs13 mt4" style="color:#AFAFAF">{{ size | formatFileSize }}</div>
        <!-- <div class="download-btn" @click="onDownload">{{ isMobile() ? '查看' : '下载' }}</div> -->
      </div>
      <div v-if="delectAttr" @click="onDelleAttr()" class="delleAttr">
        <img :src="require('@/assets/images/msg/img_icon_close.png')" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { isMobile, isImageType } from "@/utils";
import FileSaver from "file-saver";

export default {
  name: "AttachmentItem",
  props: [
    "spuName",
    "brandName",
    "fileName",
    "fileType",
    "size",
    "attaId",
    "isProtect",
    "attaUrl",
    'parent_Class',
    'parent_Style',
    'delectAttr' 
  ],
  data() {
    return {};
  },
  computed: {},
  created() {
    
  },
  mounted() {},
  methods: {
    fileTypeImage(fileType) {
      if (fileType === "ppt" || fileType === "pptx") {
        return require("@/assets/images/file/ppt.png");
      } else if (fileType === "xlsx") {
        return require("@/assets/images/file/xlsx.png");
      } else if (fileType === "doc" || fileType === "docx") {
        return require("@/assets/images/file/doc.png");
      } else if (fileType === "pdf") {
        return require("@/assets/images/file/pdf.png");
      } else {
        return require("@/assets/images/file/file.png");
      }
    },
    isMobile,
    async onDownload() {
      if (!this.attaUrl) {
        return;
      }
      if(this.delectAttr)return

      let attaUrl = this.attaUrl;
      // PC端不支持文件预览接口
      if (isMobile()) {
        // 移动端使用微信接口
        if (isImageType(attaUrl)) {
          // 图片预览
          wx.previewImage({
            current: attaUrl,
            urls: [attaUrl]
          });
        } else {
          // 文件预览
          wx.previewFile({
            url: attaUrl, // 需要预览文件的地址(必填，可以使用相对路径)
            name: this.fileName, // 需要预览文件的文件名(不填的话取url的最后部分)
            size: this.size // 需要预览文件的字节大小(必填)
          });
        }
      } else {
        // PC端使用file-saver插件下载
        this.getBlob(attaUrl).then(blob => {
          FileSaver.saveAs(blob, this.fileName);
        });
      }
      // download(this.isProtect, this.attaId)
      //   .then(res => {
      //     console.log("附件url", res)
      //     let attaUrl = res
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    getBlob(url) {
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };
        xhr.send();
      });
    },
    onDelleAttr(){
      this.$emit('Delle',this.attaId)
    }
  }
};
</script>

<style lang="scss" scoped>
.attachment-item {
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  margin-bottom: 14px;
  padding: 14px;
  height:88px;
  background:rgba(255,255,255,1);
  border-radius:8px;
  align-items: center;
  margin-bottom: 14px;
  box-shadow:0px 1px 9px 0px rgba(87,180,180,0.07);
  position: relative;
  .content-box {
    flex: 1;
    margin-left: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-x: hidden;
    .spu-name,
    .file-name {
      color: #262626;
      font-size: 14px;
    }
    .brand-name {
      color: #b3b3b3;
      font-size: 12px;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .size-tag {
        font-size: 11px;
        color: #ffffff;
        background-color: #ff497c;
        border-radius: 5px;
        height: 18px;
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .download-btn {
        color: #3d93ff;
        background-color: rgba(242, 249, 255, 1);
        border: 1px solid rgba(61, 147, 255, 1);
        width: 51px;
        // height: 21px;
        // line-height: 19px;
        text-align: center;
        border-radius: 15px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        padding: 2px 0;
      }
    }
    p {
      word-break: break-word;
    }
  }
}
.delleAttr{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0,-50%);
}
</style>
