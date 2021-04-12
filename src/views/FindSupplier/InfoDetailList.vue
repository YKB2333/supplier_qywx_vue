<template>
  <div>
    <BaseDefaultNull :show='!list || !list.length'></BaseDefaultNull>
    <div
      class="ptb24 row space-between wpct92 mauto van-hairline--bottom "
      v-for="(item_list,list_index) in list"
      :key="list_index"
      @click="$router.push({path:'/newsdetails',query: {id: item_list.id}})"
    >
      <img :src="item_list.titleImage || require('@/assets/images/logo.png')"  width="109" height="109" class="object-contain">
      <div class="flex-1 ml12 col " style="overflow: hidden;justify-content: center;" >
        <p class="fs16 l-h21 mb10 mt2 ellipsis2">{{ item_list.title }}</p>
        <!-- <p v-if="item_list.supplierName" class="  ellipsis">
          <span class="ptb4 plr6 fs14 fw500 " style=" line-height: 14px;background-color:rgba(87, 180, 180, .1);border-radius: 1px;">
            <span style="color: #57B4B4;">
              {{ item_list.supplierName }}
            </span>
          </span>
        </p> -->
        <p class="fs12 fw400 l-h17 mt14" style="color: #999999;">
          {{ format( item_list.createTimestamp )  }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import { getListBySupplierId  } from "@/api/cmsInfo";

import BaseDefaultNull from "@/components/BaseDefaultNull";
export default {
  name: 'InfoDetailList',
    components: { BaseDefaultNull },
  data() {
    return {
      list: [],
      supplierId: null,
      finished: false,
      loading: false
    }
  },
  async created() {
    this.supplierId = this.$route.query.id;
    getListBySupplierId(this.supplierId).then(res => {
      this.list = res || []
    })
  },
  methods: {
    format(date) {
      if (!date) {
        return ''
      }
      return formatDate( date, 'Y年M月D日' )
    },
  }
}
</script>

<style>

</style>