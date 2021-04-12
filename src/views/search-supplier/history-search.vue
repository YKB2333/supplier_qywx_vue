<template>
  <div class="search-page" :class="{'show-history': isShowHistory}">
    <form action="/">
      <van-search
        v-model.trim="searchVal"
        :placeholder="placeholder"
        shape="round"
        @search="onSearch"
        show-action
        autofocus
        @focus="onFocus"
        :left-icon="hasRole ? '' : 'search'"
      >
        <div slot="label" v-if="hasRole">
          <van-popover
            v-model="isShowSearchPopover"
            trigger="click"
            placement="bottom-start"
          >
            <div class="search-condition">
              <div 
                @click="onSelect('0')"
                :class="{'search-active-class' : type === '0'}" 
                class="row center-y h44 w200 space-between mlr18" 
                style="border-bottom:1px solid #F5F6F9;">
                <div class="fs14">供应商</div>
                <img :src="require('@/assets/images/kt_icon_xz.png')" class="w-h22 popuper-arrow" />
              </div>
              <div 
                @click="onSelect('1')"
                :class="{'search-active-class' : type === '1'}" 
                class="row center-y h44 w200 space-between mlr18">
                <div class="fs14">物料</div>
                <img :src="require('@/assets/images/kt_icon_xz.png')" class="w-h22 popuper-arrow"/>
              </div>
            </div>
            <template #reference>
              <span class="triangle pr20 color-black" style="border-right:2px solid #EEEEEE;">{{type === '0' ? '供应商' : '物料'}}</span>
            </template>
          </van-popover>
        </div>
        <span slot="action" @click="onSearch(searchVal)">搜索</span>
      </van-search>
    </form>
    <div v-if="isShowHistory" class="plr14 pb20 pt30">
      <template>
        <div class="title-container">
          <p class="title">历史搜索</p>
          <img :src="require('@/assets/images/icon_delete.png')" width="22" @click="onClear" class="pointer" v-if="searchHistory.length">
        </div>
        <div class="list-wrapper">
          <div v-for="(item, index) in searchHistory" :key="index" class="record-item" @click="onSearch(item)">{{ item }}</div>
        </div>
      </template>
      <div class="title-container mt20">
        <p class="title">热门搜索</p>
      </div>
      <div class="list-wrapper">
        <div v-for="(item, index) in hotValues" :key="index" class="record-item" @click="onSearch(item)">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      searchVal: '',
      hotValues: ['千妇恋', '洁面乳', '洁面乳', '沐浴露'],
      isShowHistory: false,
      isShowSearchPopover: false,
      type: '0', // 0 供应商， 1 物料
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'roleList'
    ]),
    role() {
      return JSON.parse(this.roleList)
    },
    hasRole() {
      // return 1
      return Array.isArray(this.role) && this.role.length > 0
    }
  },
  watch: {
    value(val) {
      this.searchVal = val || ''
    }
  },
  created() {},
  methods: {
    onSearch(val) {
      if (!val) return
      this.$store.commit('SET_SEARCH_HISTORY', val)
      this.$emit('input', val)
      this.$emit('search', val)
      this.isShowHistory = false
    },
    onClear() {
      this.$dialog.confirm({
        title: '确认清除吗？',
      }).then(() => {
        this.$store.commit('SET_SEARCH_HISTORY', [])
      }).catch(() => {
        // on cancel
      })
    },
    onFocus() {
      this.isShowHistory = true
    },
    onSelect(type) {
      this.type = type
      this.$emit('change-type', type)
      this.isShowSearchPopover = false
    }
  },
};
</script>
<style lang="scss" scoped>

.search-page {
  // padding: 20px 16px;
  &.show-history{
    // height: 100vh;
    // overflow-y: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #ffffff;
    z-index: 999;
  }
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 15px;
      color: #262626;
      font-weight: 600;
    }
  }
  .list-wrapper {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;
    .record-item {
      background-color: #f6f6f6;
      color: #AFAFAF;
      font-size: 13px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 20px;
    }
  }
  .triangle {
    position: relative;
    color: rgb(149, 156, 167);
    span{
      width: 70%;
      display: inline-block;
    }
    &.active{
      color: #3A78EF;
    }
  }
  .triangle::after {
    content: "";
    position: absolute;
    right: 14%;
    width: 0;
    height: 0;
    top: 60%;
    transform: translate(0, -45%);
    border-top: 3px solid #959ca7;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 3px solid transparent;
  }
  /deep/ .van-search__label{
    padding: 0 8px 0 0;
  }
}
.search-condition{
  .search-active-class{
    color: #57B4B4;
    .popuper-arrow{
      display: inline-block;
    }
  }
  .popuper-arrow{
    transform: translateX(8px);
    display: none;
  }
}
.color-black{
  color: #323233 !important;
}
</style>