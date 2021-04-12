<template>
  <div id="page">
    <div class="caseTitle" v-if="info.title">
      <p>{{info.title}}</p>
      <p ><span class="mr10" style='color:#5B6A91;'>{{info.source}}</span>{{showRecentTime(info.createTimestamp)}}</p>
    </div>

    <!-- 资讯附件列表 -->
    <div v-if="attaList.length" class="plr14 pb2">
      <atta-item 
        style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
        v-for="(item, index) in attaList" :key="index"
        :file-name="item.fileName"
        :file-type="item.fileType"
        :size="item.size"
        :attaUrl="item.attaUrl"
      />
    </div>
  </div>
</template>

<script>
import { getOne, getAttaById } from '@/api/cmsInfo'
import { isEmpty, showRecentTime } from '@/utils'
import AttaItem from '@/components/AttachmentItem'

export default {
  name: 'ShareDetails',
  components: { AttaItem },
  data() {
    return {
      info: {},
      attaList: []
    }
  },
  computed: {},
  created() {
    this.$toast.loading({duration: 0,message: "加载中...",forbidClick: true});
    this.fetchCmsInfoData();
    this.fetchCmsInfoAtta()
  },
  methods: {
    showRecentTime,
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res
        this.$toast.clear();
      })
    },
    fetchCmsInfoAtta() {
      return getAttaById(this.$route.query.id).then(res => {
        this.attaList = res
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
    margin-top:14px;
    color: rgba(149, 156, 167, 1);
  }
}
.richText {
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  margin-top: 19px;
  font-size: 15px;
  font-weight: 400;
  color: rgba(57, 60, 65, 1);
  line-height: 30px;
}
</style>
