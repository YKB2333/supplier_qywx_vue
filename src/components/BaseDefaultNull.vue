<template>
  <div v-if="show" :class="['row center-x mt50 wpct40 mauto',parentClass]">
    <img :src="require('@/assets/images/msg/default_img_none@2x.png')"   style="object-fit: contain;" class="wpct100" alt="">
  </div>
</template>

<script>
export default {
  name: "BaseTitle",
  props: {
    parentClass: { // 
      type: String,
      default: ""
    },
    show: { // 
      type: Boolean,
      default: ""
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
  },
  methods: {
  
  }
};
</script>

<style lang="scss" scoped>
</style>
