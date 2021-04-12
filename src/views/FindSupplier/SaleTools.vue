<template>
  <div style="height: 100vh; background-color: white; overflow-y: auto;" class="pt10">
    <div v-for="(info, index) in infoList" :key="index" class="white-bg mb20">
      <div class="fs18 fw600 pl18 ptb20">{{ info.title }}</div>
      <div class="plr18 pb14">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, j) in showAttaList(info.id)"
          :key="j"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaId="item.id"
          :attaUrl="item.attaUrl"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { selectPage as cmsSelectPage, getAttaById } from "@/api/cmsInfo";
import AttaItem from "@/components/AttachmentItem";
import { cmsCategoryId } from "@/config";

export default {
  name: 'SaleTools',
  components: { AttaItem },
  data() {
    return {
      infoList: [], // 资讯列表
      attaListModel: []
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        this.infoList = await this.fetchInfoList()
        let infoIds = this.infoList.map(item => item.id)
        console.log(infoIds)
        for(let i = 0; i < infoIds.length; i++) {
          let attaList = await this.fetchCmsInfoAtta(infoIds[i])
          this.attaListModel.push({
            infoId: infoIds[i],
            attaList: attaList
          })
        }
        console.log(this.attaListModel)
      } catch (error) {
        
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    fetchInfoList() {
      return new Promise((resolve, reject) => {
        cmsSelectPage({
          pageIndex: 1,
          pageSize: 100,
          infoCategoryId: cmsCategoryId.information,
          status: '1',
          orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
        }).then(res => {
          resolve(res.records)
        }).catch(error => {
          reject(error)
        })
      })
    },
    fetchCmsInfoAtta(infoId) {
      return new Promise((resolve, reject) => {
        getAttaById(infoId).then(res => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    showAttaList(infoId) {
      let arr = []
      this.attaListModel.every(item => {
        if (item.infoId === infoId) {
          arr = item.attaList
          return false
        } else {
          return true
        }
      })
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
