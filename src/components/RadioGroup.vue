<template>
  <div id="radio-group">
    <div 
      v-for="(item, index) in list" :key="index" 
      class="radio-btn"
      :class="{ 'active': item.value === value, 'flex-1': full }"
      @click="onClick(item)"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioGroup',
  props: {
    list: {
      type: Array
    },
    value: {
      type: Number
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onClick(item) {
      if (item.value === this.value) return
      this.$emit('input', item.value)
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="scss" scoped>
#radio-group{
  display: flex;
  .radio-btn{
    background-color: #eeeeee;
    height: 30px;
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #707070;
    font-size: 13px;
    cursor: pointer;
    &.active{
      background-color: #57B4B4;
      color: #fff;
    }
  }
}
</style>
