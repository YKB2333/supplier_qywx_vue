<template>
  <van-tabbar v-model="tabIndex">
    <van-tabbar-item 
      v-for="(item, index) in data" :key="index" 
      :icon="item.icon" 
      :to="item.path"
    >
      {{ item.title }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>

export default {
  name: 'Tabbar',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
    }
  },
  computed: {
    tabIndex: {
      get() {
        let paths = this.$config.tabbarPaths
        let index = paths.findIndex((value, index, arr) => {
          return value === this.$route.path
        })
        return index
      },
      set(val) {
        // console.log(val);
      }
    },
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>