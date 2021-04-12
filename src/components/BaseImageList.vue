<template>
  <div
    :class="['row','space-between','wpct92','mauto',type == 'right' ? 'row-reverse':'', parent_Class, border ? 'van-hairline--bottom':'']"
    @click="is_link ? getLink() : null"
  >
    <!-- 文字 -->
    <div
      class="flex-1"
      :class="[type == 'right' ? 'ml16' :'mr16',Title_Class]"
      style="overflow: hidden;"
    >
      <slot name="title">
        <div style="color:#262626" class="mt6">
          <p class="h44 fs16 fw600 ellipsis2">{{ title }}</p>
        </div>
        <slot name="value">
          <div style="color:#AFAFAF" class="mt14">
            <span class="fs12">{{ value }}</span>
          </div>
        </slot>
      </slot>
    </div>
    <!-- img -->
    <slot name="img">
      <div :class="imgClass? imgClass :'w120 h90 hidden row'" style="background: #F9F9F9;position: relative;"  >
        <img :src="src" :class="imgClassSon" class="pos-center" style="max-width: 100%;max-height: 100%;" alt />
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "BaseImagelist",
  props: {
    type: {
      // 图文左右方向
      type: String,
      default: "left"
    },
    title: {
      // 标题
      type: String,
      default: ""
    },
    value: {
      //  标题下文本
      type: String,
      default: ""
    },
    src: {
      //  图片地址
      type: String,
      default: ""
    },
    is_link: {
      // 是否跳转开关
      type: Boolean,
      default: false
    },
    url: {
      //跳转地址
      type: String,
      default: ""
    },
    imgClass: {
      //img样式
      type: String,
      default: ""
    },
    to: {
      //路由跳转地址
    },
    parent_Class: {
      //  父div class
      type: String,
      default: ""
    },
    Title_Class: {
      type: String,
      default: ""
    },
    imgClassSon: {
      type: String,
      default: ""
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    getLink() {
      if (this.url) window.location.href = this.url;
      if (this.to) {
        this.$router.push(
          this.to.hasOwnProperty("path") ? this.to : { path: this.to }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .van-hairline--bottom{
//   border-bottom: 1px solid #F4F4F4;
// }
</style>
