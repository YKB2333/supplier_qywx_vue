<template>
  <div class="page">
    <!-- 供应商头部 -->
    <div class="h218 wpct100 supplier">
      <img
        src="@/assets/images/home/banner1.png"
        class="wpct100 h140 hidden"
        style="object-fit: cover;"
      />
      <div class="supplierHader">
        <div class="supplierImg">
          <img :src="goodsDetail && goodsDetail.titleImage || require('@/assets/images/logo.png')" />
        </div>
        <p class="ellipsis2">{{ goodsDetail && goodsDetail.name }}</p>
      </div>
    </div>

    <!-- 物料头部 -->
    <BaseTableCell :data="BasicInformation" class="mt20"></BaseTableCell>
  </div>
</template>

<script>
import BaseTableCell  from  '@/components/BaseTableCell';
import { getGoodsDetail, getSupDetail } from '@/api/supplier'
export default {
  name: "MaterialDetails",
  components: {BaseTableCell},
  data() {
    return {
      id: null,
      goodsDetail: null,
      supplier: null,
      BasicInformation:[],
      supplierMsg:[],
    };
  },
  computed: {},
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.init()
  },
  methods: {
    async init(){
      await this.fetchGoodsDetail()
      await this.fetchSupplierDetail()
      let goods = this.goodsDetail
      let supplier = this.supplier
      let supType = '' // 供应商类型

      goods.attaImages.forEach(item => {
        item['label'] = item.fileName
        item['url'] = item.attaUrl
      })

      if (goods.supType === 1) {
        supType = '代理'
        this.BasicInformation = [
          { label: '供应商名称', value: supplier.name },
          { label: '供应商编码', value: supplier.code },
          { label: '产品名称', value: goods.name },
          { label: '产品条码', value: goods.code },
          { label: '产品类型', value: this.getProTypeName(goods.proType) },
          { label: '产品分类', value: goods.cateName },
          { label: '推荐等级', value: goods.level },
          { label: '供应商类型', value: supType, border: true },
          { label: '产品规格', value: goods.materialSpecs},
          { label: '带包装的产品尺寸（长、宽、高）', value: (goods.length || '-') + 'x' + (goods.weight || '-') + 'x' + (goods.height || '-') },
          { label: '产品主图', value: [{label: '', url: goods.titleImage}], type: 'row_img'},
          { label: '产品附图', value: goods.attaImages, type: 'img'},
          { label: '品牌名', value: goods.brandName},
          { label: `产品采购价（${goods.isTax ? '含税' : '不含税'}）`, value: goods.price },
          { label: '产品建议零售价', value: goods.msrp },
          { label: '保质期  ', value: goods.shelfLife },
          { label: '起订量', value: goods.moq },
          { label: '正常货期', value: goods.deliveryCycle },
          { label: '已做渠道', value: goods.salesChannels },
          { label: '产品核心介绍/功能介绍', value: goods.productDescribe },
        ]
      } else if (goods.supType === 2) {
        supType = '制造'
        this.BasicInformation = [
          { label: '供应商名称', value: supplier.name },
          { label: '供应商编码', value: supplier.code },
          { label: '产品名称', value: goods.name },
          { label: '产品条码', value: goods.code },
          { label: '产品类型', value: this.getProTypeName(goods.proType) },
          { label: '产品分类', value: goods.cateName },
          { label: '推荐等级', value: goods.level },
          { label: '供应商类型', value: supType, border: true },
          { label: '产品规格', value: goods.materialSpecs},
          { label: '带包装的产品尺寸（长、宽、高）', value: (goods.length || '-') + 'x' + (goods.weight || '-') + 'x' + (goods.height || '-') },
          { label: '产品主图', value: [{label: '', url: goods.titleImage}], type: 'row_img'},
          { label: '产品附图', value: goods.attaImages, type: 'img'},
          { label: `产品采购价（${goods.isTax ? '含税' : '不含税'}）`, value: goods.price },
          { label: '产品建议零售价', value: goods.msrp },
          { label: '保质期  ', value: goods.shelfLife },
          { label: '起订量', value: goods.moq },
          { label: '正常货期', value: goods.deliveryCycle },
          { label: '产品材质', value: goods.materialQuality },
          { label: '包装方式', value: goods.packingMethod },
          { label: '是否可定制', value: goods.isSupportOdm ? '是': '否' },
          { label: '打样费', value: goods.proofingPrice },
          { label: '打样时长', value: goods.proofingCycle },
          { label: '产品核心介绍/功能介绍', value: goods.productDescribe },
        ]
      } else {
        supType = '-'
        this.BasicInformation = [
          { label: '供应商名称', value: supplier.name },
          { label: '供应商编码', value: supplier.code },
          { label: '产品名称', value: goods.name },
          { label: '产品条码', value: goods.code },
          { label: '产品类型', value: this.getProTypeName(goods.proType) },
          { label: '产品分类', value: goods.cateName },
          { label: '推荐等级', value: goods.level },
          { label: '供应商类型', value: supType, border: true },
          { label: '产品规格', value: goods.materialSpecs},
          { label: '带包装的产品尺寸（长、宽、高）', value: (goods.length || '-') + 'x' + (goods.weight || '-') + 'x' + (goods.height || '-') },
          { label: '产品主图', value: [{label: '', url: goods.titleImage}], type: 'row_img'},
          { label: '产品附图', value: goods.attaImages, type: 'img'},
          { label: `产品采购价（${goods.isTax ? '含税' : '不含税'}）`, value: goods.price },
          { label: '产品建议零售价', value: goods.msrp },
          { label: '保质期  ', value: goods.shelfLife },
          { label: '起订量', value: goods.moq },
          { label: '正常货期', value: goods.deliveryCycle },
          { label: '产品核心介绍/功能介绍', value: goods.productDescribe },
        ]
      }
    },
    isType(item){
      if(!item || item.length== 0) return 'text';
      return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf( item[0].fileType.toLowerCase() ) !== -1 ?  'img' :  'file'; 
    },
    // 清楚标签竖线
    clearTag(data){
      if(Array.isArray(data)){
        return data.join(', ')
      }
      return data.split("|").filter(n => n).join(', ');
    },
    // 格式化附件对象
    clearAttaType(data){
      if(!data)return ;
      let arr =  [];
      data.forEach(item => {
        arr.push({
          label:item.fileName ,
          url: item.attaUrl,
        })
      });
      return arr
    },
    // 物料详情
    fetchGoodsDetail() {
      return getGoodsDetail(this.id).then(res => {
        this.goodsDetail = res
      }).catch(error => {
        console.log(error)
      })
    },
    // 供应商详情
    fetchSupplierDetail() {
      return getSupDetail(this.goodsDetail.supId).then(res => {
        this.supplier = res
      }).catch(error => {
        console.log(error)
      })
    },
    getProTypeName(data){
      if(data == 0) return '其他'
      if(data == 1) return '成品'
      if(data == 2) return '配件'
      if(data == 3) return '原料'
      return "-"
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  overflow-x: hidden;
}
.supplier {
  position: relative;
}
//供应商头部
.supplierHader {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 152px;
  width: 90%;

  p {
    font-size: 18px;
    font-weight: 600;
    color: rgba(38, 38, 38, 1);
    text-align: center;
    margin-top: 12px;
  }
}
// 头像
.supplierImg {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid white;
  overflow: hidden;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>