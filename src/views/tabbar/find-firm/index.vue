<template>
  <div class="find-page">
    <!-- 顶部tab 供应商、物料库 -->
    <div class="row space-between center-y plr16 pb8">
      <van-tabs 
        v-model="tabActive" 
        line-width="28" 
        :border="false"
        :ellipsis="false"
        color="#57B4B4" 
        title-active-color="#262626" 
        title-inactive-color="#afafaf"
      >
        <van-tab :title="supplierTabName" v-if="roleList.length > 0 " :name="0" ></van-tab>
        <van-tab title="物料库" :name="1" ></van-tab>
      </van-tabs>
      <div class="pointer" @click="onClickSearchIcon">
        <img :src="require('@/assets/images/icon_search.png')" width="22">
      </div>
    </div>
    <!--  -->
    <div v-show="tabActive === 0" class="flex-1 y-scroll">
      <supplier ref="supplier" :router-type="routerType" />
    </div>
    <div v-show="tabActive === 1" class="flex-1 y-scroll">
      <materials ref="materials" />
    </div>
  </div>
</template>

<script>
import Supplier from './supplier'
import Materials from './materials'
import { role } from "@/const/supplier/role";
import { mapGetters } from 'vuex'
import { savePosition } from '@/mixins'

export default {
  name: 'Find',
  components: {
    Supplier, Materials
  },
  // mixins: [new savePosition('scroll-list')],
  data() {
    return {
      role,
      tabActive: 0,
      hasInitSup: false,
      hasInitMet: false,
      routerType: '',
      isCache: false
    }
  },
  computed: {
    
    ...mapGetters({
      roleArr: 'roleList'
    }),
    roleList() {
      return JSON.parse(this.roleArr);
    },
    supplierTabName() {
      let roleArr = this.roleList;
      if (roleArr.includes('visitor_qywx_admin')) {
        return '供应商'
      }
      if (roleArr.includes('visitor_qywx_depart_manager')) {
        return '部门供应商'
      }
      return '我的供应商'
    }
  },
  created() {
    if (this.$route.query.type) {
      this.routerType = this.$route.query.type
    }
  },
  activated() {
    if (this.isCache) {
      if (this.tabActive === 0) {
        this.$refs['supplier'].resumeScrollTop()
      } else if (this.tabActive === 1) {
        this.$refs['materials'].resumeScrollTop()
      }
      return ;
    }
    // this.roleList = JSON.parse(this.$store.getters.roleList)
    this.tabActive = this.roleList.length > 0 ? 0 : 1

    if (this.$route.query.type) {
      this.routerType = this.$route.query.type
    }
    if (this.tabActive === 0) {
      this.$refs['supplier'].resumeScrollTop()
    } else if (this.tabActive === 1) {
      this.$refs['materials'].resumeScrollTop()
    }
  },
  beforeRouteLeave(to, from , next) {
    this.isCache = from.meta.needCachePages && from.meta.needCachePages.includes(to.name);
    if (this.tabActive === 0) {
      this.$refs['supplier'].saveScrollTop()
    } else if (this.tabActive === 1) {
      this.$refs['materials'].saveScrollTop()
    }
    next()
  },
  methods: {
    // 跳转搜索页
    onClickSearchIcon() {
      this.$router.push({
        path: '/search-supplier',
        query: {
          type: this.tabActive
        }
      })
    }
  },
  watch: {
    tabActive: {
      handler: function(i) {
        console.log('watch--tabActive', i)
        if (i === 0) {
          if (!this.hasInitSup) {
            this.$nextTick(() => {
              this.$refs['supplier'].init()
              this.hasInitSup = true
            })
          }
        } else if (i === 1) {
          if (!this.hasInitMet) {
            this.$nextTick(() => {
              this.$refs['materials'].init()
            })
            this.hasInitMet = true
          }
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.find-page {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
}
/deep/ .split-border {
  border-top: 10px solid #F6F6F6;
}

/deep/ .van-sidebar {
  width: 100px;
  height: 100%;
  overflow-y: auto;
  background-color: #F9F9F9;
  .van-sidebar-item {
    padding: 15px 8px;
    text-align: center;
    &--select{
      border-left: none;
      position: relative;
      &::before{
        content: ' ';
        display: inline-block;
        width: 3px;
        height: 20px;
        background-color: #57B4B4;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .van-sidebar-item--select {
    font-weight: 600;
  }
}

/deep/ .van-tabs__line {
  bottom: 18px;
}

/deep/ .van-tab {
  margin-right: 20px;
}
</style>
