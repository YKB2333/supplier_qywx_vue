export const savePosition = function(scrollId) {
  return {
    data() {
      return {
        myScrollTop: 0
      }
    },
    activated() {
      // console.log('activated')
      let target = scrollId ? document.getElementById(scrollId) : document.getElementById('app')
      target ? target.scrollTop = this.myScrollTop : ''
    },
    beforeRouteLeave (to, from, next) {
      let target = scrollId ? document.getElementById(scrollId) : document.getElementById('app')
      this.myScrollTop = target.scrollTop || 0
      // console.log('scrollTop', target.scrollTop)
      next()
    },
  }
};