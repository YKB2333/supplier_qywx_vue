<template>
  <div>
    <div class="row space-between h60 center-y wpct92 mauto">
      <!-- 标题 -->
      <slot name="title">
        <h4 :class="title_Class ? title_Class :['fw600', 'fs18','flex-1']">{{title || '标题'}}</h4>
      </slot>
      <!-- 右侧文本内容 -->
      <div
        v-if="isValue || value || this.$slots.value "
        @click="is_link ? getLink() : null"
        :class="['row','center-y',right_Class ? right_Class :['fs14']]"
        style="color:#afafaf"
      >
        <slot name="value">{{ value || '更多'}}</slot>
        <van-icon name="arrow" color="#afafaf" v-if="icon" />
      </div>
      <div v-else-if="isEmply && emplyType === 'txt'">
        <slot name="value">{{'暂无数据'}}</slot>
      </div>
    </div>
    <div v-if="isEmply && emplyType === 'img'" class="text-center">
      <img :src="require('@/assets/images/discover_pic_other@3x.png')" width="30%" />
      <p class="fs12 mtb12" style="color: #AFAFAF;">暂时没有内容哦</p>
    </div>
  </div>
  <!--
    用法
     <VTitle  @link="getLink()" icon  >
      <template v-slot:title>标题xxxx</template>
      <template v-slot:value>
        <p>右侧文本内容xxxx</p>
      </template>
    </VTitle>
  -->
</template>

<script>
export default {
  name: "BaseTitle",
  props: {
    title: {
      // 标题
      type: String,
      default: ""
    },
    value: {
      //  右侧文本
      type: String,
      default: ""
    },
    isValue: {
      //  是否显示右侧文本
      type: Boolean,
      default: null
    },
    icon: {
      // 是否显示 右侧箭头
      type: Boolean,
      default: false
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
    to: {
      //路由跳转地址
    },
    title_Class: {
      // 标题类格外类名
      type: Array,
      default: () => {
        [];
      }
    },
    right_Class: {
      // 右侧格外类名
      type: Array,
      default: () => {
        [];
      }
    },
    isEmply: {
      //  是否显示 暂无数据
      type: Boolean,
      default: false
    },
    emplyType: {
      //  是否显示 样式
      type: String,
      default: 'txt'
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
        console.log(this.to);
        this.$router.push(
          this.to.hasOwnProperty("path") ? this.to : { path: this.to }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
