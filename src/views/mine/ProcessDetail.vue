<template>
  <div>
    {{ infoDetail && infoDetail.title }}
  </div>
</template>

<script>
import { getOne as getInfoDetail } from '@/api/cmsInfo'

export default {
  name: 'ProcessDetail',
  components: {},
  data() {
    return {
      infoId: null,
      infoDetail: null
    }
  },
  created() {
    this.infoId = this.$route.query['infoId']
    this.init()
  },
  methods: {
    init() {
      getInfoDetail(this.infoId).then(res => {
        this.infoDetail = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
