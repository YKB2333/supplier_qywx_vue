<template>
  <div class="plr16">
    <div class="info-card rtl center-y" :class="{ 'van-hairline--bottom pb20': border }">
      <div v-if="showImage" class="title-img-wrapper" style="background:#F9F9F9;" >
        <img :src="titleImage || require('@/assets/images/defaultLogo.png')" style="width:100%;align-self:center;" />
      </div>
      <div class="content">
        <p class="title van-multi-ellipsis--l2" :class="{ 'mb20' : !showImage }">{{ title }}</p>
        <div class="label-box space-between mt14">
          <template v-if="$slots.label"><slot name="label"></slot></template>
          <div v-else class="row center-y">
            <img v-if="!hideCollect" :src="collectImage" alt="收藏图标" width="22" @click.stop="$emit('collect')">
            <img v-if="!hideLike" :src="likeImage" alt="点赞图标" width="22" class="like-image" @click.stop="$emit('like')">
            <span v-if="!hideLike" class="like-count">{{ likeCount }}</span>
          </div>
          <slot name="time"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    titleImage: { // 主图
      type: String,
    },
    title: { // 标题
      type: String
    },
    isCollect: { // 收藏
      type: Boolean,
      default: false
    },
    isLike: { // 点赞
      type: Boolean,
      default: false
    },
    likeCount: { // 点赞数
      type: Number,
      default: 0
    },
    hideCollect: {
      type: Boolean,
      default: false
    },
    hideLike: {
      type: Boolean,
      default: false
    },
    showImage: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      
    }
  },
  computed: {
    collectImage() {
      if (this.isCollect) return require('@/assets/images/mine/icon_collected.png')
      return require('@/assets/images/mine/icon_collect.png') 
    },
    likeImage() {
      if (this.isLike) return require('@/assets/images/mine/icon_liked.png')
      return require('@/assets/images/mine/icon_like.png') 
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.info-card{
  display: flex;
  // padding: 0 16px;
  margin-bottom: 20px;
  &.rtl{
    flex-direction: row-reverse;
  }
  .title-img-wrapper{
    display: flex;
    width: 120px;
    height: 90px;
    overflow: hidden;
  }
  &.rtl{
    .title-img-wrapper{
      margin-left: 16px;
    }
  }
  .content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title{
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
    img{
      width: 18px;
    }
    .label-box{
      font-size: 12px;
      color: #AFAFAF;
      display: flex;
      align-items: center;
    }
    .like-image{
      margin-left: 20px;
    }
    .like-count{
      margin-left: 6px;
    }
  }
}
</style>
