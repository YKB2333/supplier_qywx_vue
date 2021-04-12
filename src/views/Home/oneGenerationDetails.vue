<template>
  <div id="page">
    <div class="caseTitle">
      <p>{{info.title}}</p>
      <p>{{showRecentTime(info.createTimestamp)}}</p>
    </div>
    <div class="richText" v-html="info.content"></div>
  </div>
</template>

<script>
import { getOne } from '@/api/cmsInfo'
import { isEmpty, showRecentTime } from '@/utils'
export default {
  name: 'OneGenerationDetails',
  components: {},
  data() {
    return {
      info: {}
    }
  },
  computed: {},
  created() {
    this.fetchCmsInfoData()
  },
  methods: {
    showRecentTime,
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.caseTitle {
  width: 90%;
  margin: 0 auto;
  margin-top: 3%;
  font-size: 20px;
  font-weight: 600;
  color: rgba(57, 60, 65, 1);
  line-height: 28px;
  p {
    margin: 0;
    padding: 0;
  }
  p:nth-child(2) {
    font-size: 14px;
    font-weight: 500;
    color: rgba(149, 156, 167, 1);
  }
}
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
</style>
