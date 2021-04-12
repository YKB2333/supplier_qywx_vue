<template>
  <svg :class="svgClass" aria-hidden="true" :style="{'width': width, 'height': height}">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
// <svg-icon name="home" color="#198192" width="32px" height="32px" />
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    className: {
      type: String,
      default: ''
    },
    width: {
      type: String, 
      default: '1em'
    },
    height: {
      type: String, 
      default: '1em'
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  /* width: 1em;
  height: 1em; */
  fill: currentColor;
  overflow: hidden;
}
</style>
