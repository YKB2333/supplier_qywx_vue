<template>
  <div class="page">
    <!-- 供应商头部 -->
    <div class="h218 wpct100 supplier">
      <img
        src="@/assets/images/home/banner.png"
        class="wpct100 h140 hidden"
        style="object-fit: cover;"
      />
      <div class="supplierHader">
        <div class="supplierImg">
          <img class="pos-center" :src="supplierMsg.logo || require('@/assets/images/logo.png')" />
        </div>
        <p class="ellipsis2">{{supplierMsg.name}}</p>
      </div>
    </div>
    <!-- 供应商主体 -->
    <div class="gallery-thumbs wpct100 mauto hidden">
      <div class="swiper-wrapper classification">
        <span class="swiper-slide" v-for="item in pageTitle" :key="item.id">{{ item.name }}</span>
      </div>
    </div>

    <div class="gallery-top">
      <div class="swiper-wrapper">
        <!-- 基本信息 -->
        <div class="swiper-slide galleryDiv">
          <BaseTableCell :data="basicInformation"></BaseTableCell>
        </div>
        <!-- 供应商规模 -->
        <div class="swiper-slide galleryDiv">
          <BaseTableCell :data="supplierSize"></BaseTableCell>
        </div>
        <!-- 财务信息 -->
        <div class="swiper-slide galleryDiv">
          <BaseTableCell :data="financialInformation"></BaseTableCell>
        </div>
        <!-- 合作信息 -->
        <div class="swiper-slide galleryDiv">
          <BaseTableCell :data="cooperationInformation"></BaseTableCell>
        </div>
        <!-- 合作产品 -->
        <div class="swiper-slide galleryDiv">
          <van-grid :border="false" :column-num="2" :gutter="10" class="Cooperation pt10 pb10">
            <van-grid-item v-for="item in coopGoodsList" :key="item.id" class="Cooperation_son" @click="$router.push({name:'productDetails',query:{id:item.id,supId: $route.query.id,type:'coop'}})">
              <div>
                <img :src="item.titleImage || require('@/assets/images/logo.png')" alt />
              </div>
              <p>{{ item.name }}</p>
            </van-grid-item>
          </van-grid>
          <BaseDefaultNull  :show='!coopGoodsList.length'></BaseDefaultNull>
          <p v-if="!coopGoodsList.length" class="fs13 text-center pt30">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSupTypes, getSupDetail } from "@/api/supplier";

import BaseTableCell from "@/components/BaseTableCell";
import BaseDefaultNull from "@/components/BaseDefaultNull";
import { brandCategory } from "@/const/goods";
import { isArray, log } from 'util';
import Swiper from "swiper";

export default {
  name: "SupplierDetails",
  components: { BaseTableCell ,BaseDefaultNull},
  data() {
    return {
      supTypes: {},
      brandCategory,
      supplierMsg: [], //供应商信息
      supInfo: {},
      pageTitle: [
        { id: 1, name: "基本信息" },
        { id: 2, name: "供应商规模" },
        { id: 3, name: "财务信息" },
        { id: 4, name: "合作信息" },
        { id: 5, name: "合作产品" }
      ],
      basicInformation: [], // 基础信息
      supplierSize: [], // 供应商规模
      financialInformation: [], //财务信息
      cooperationInformation: [], // 合作信息
      coopGoodsList: [],
    };
  },
  computed: {},
  created() {
    this.$toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true
    });
    this.fetchSupInfoData(); // 获取供应商信息
    this.fetchSupTypes();
  },
  mounted() {
    this.getSwiperInit();
  },
  methods: {
    async fetchSupTypes() {
      await getSupTypes().then(res => {
        res.forEach(e => {
          this.supTypes[e.code] = e.text;
        });
      });
    },
    fetchSupInfoData() {
      // "402223121394446336" 测试ID
      return getSupDetail(this.$route.query.id)
        .then(res => {
          this.supplierMsg = { logo: res.logo , name: res.name };
          let type = res.typeList
            .map(type => {
              return this.supTypes[type];
            })
            .join(",");

          let supContact = res.supContacts && res.supContacts[0] ? res.supContacts[0] : {}
          let supFinance = res.supFinances && res.supFinances[0] ? res.supFinances[0] : {}
            
          this.basicInformation = [
            { label: "企业法人", value: res.legalMan },
            { label: "产权", value: res.property }, //产权：自由、租赁
            {
              label: "成立时间",
              value: this.$utils.formatDate(new Date(res.foundingTime), "Y/M/D")
            },
            { label: "企业性质", value: res.nature }, //企业性质：外资、合资、民营、股份制、个人、其他
            { label: "主供商品", value: res.mainProduct },
            { label: "经营品牌", value: res.manageBrank },
            { label: "营业执照号", value: res.taxNo },
            { label: "备注", value: res.remark, border: true },
            {
              label: "是否一般纳税人",
              value: res.isGeneralTaxpayer ? "是" :  (res.isGeneralTaxpayer==null) ? "-": "否"
            },
            { label: "联系人", value: supContact.fullName },
            { label: "职位", value: supContact.position },
            { label: "电话", value: supContact.mobile },
            { label: "传真", value: supContact.fax },
            { label: "邮箱", value: supContact.email },
            { label: "单位地址", value: res.address, border: true },
            { label: "供应商编码", value: res.code },
            { label: "供应商名称（中文）", value: res.name },
            { label: "英文名称", value: res.nameEn },
            { label: "供应商简称", value: res.abbr },
            { label: "曾用名", value: res.nameUsed },
            { label: "国家", value: res.country },
            // { label: "标签列表", value: this.clearTag(res.typeList) },
            {
              label: "供货分类",
              value: type,
            }, //：成品、配件、原料、其他
          // { label: "供应商产品分类", value: res.categorys },  //数组 分类要显示?
            { label:'供应商类型',value: res.supplierType == 1 ? '费用供应商' : '产品供应商'},
            { label: "供应商产品分类", value: this.getName(res) ,border: true}, 
            // { label: "客户类型", value: this.clearTag(res.customerType) }, //客户类型：商超、电商、便利店、药妆店、其他
            { label: "主要业务类型", value: res.businessType },
            { label: "主要客户名称", value: res.customerName },
            { label: "主要客户类型",value: this.clearTag(res.customerType) },
            // { label: "供应商logo", value: [{label:'',url:res.logo}], type: 'img' },
            {
              label: "厂房/车间照片",
              value: this.clearAttaType(res.workPics),
              type: this.isType(res.workPics)
            },
            {
              label: "营业执照",
              value: this.clearAttaType(res.busiLicenses),
              type: this.isType(res.busiLicenses)
            }, // 字属性 fileName = label 文件名字,fileType 文件类型,attaUrl = url 文件地址,到时候写一个格式化的函数
            {
              label: "检验报告",
              value: this.clearAttaType(res.insReports),
              type: this.isType(res.insReports)
            },
            {
              label: "许可证",
              value: this.clearAttaType(res.licences),
              type: this.isType(res.licences)
            },
            {
              label: "开户许可证",
              value: this.clearAttaType(res.openPermits),
              type: this.isType(res.openPermits)
            },
            {
              label: "组织架构图",
              value: this.clearAttaType(res.orgCharts),
              type: this.isType(res.orgCharts)
            },
            {
              label: "成功案例",
              value: this.clearAttaType(res.successCases),
              type: this.isType(res.successCases)
            },
            {
              label: "其他证照",
              value: this.clearAttaType(res.otherAttas),
              type: this.isType(res.otherAttas)
            },
            {
              label: "ISO认证",
              value: this.clearAttaType(res.isos),
              type: this.isType(res.isos)
            },{
              label: "CSR认证",
              value: this.clearAttaType(res.csrs),
              type: this.isType(res.csrs)
            },{
              label: "体系认证",
              value: this.clearAttaType(res.systemAuths),
              type: this.isType(res.systemAuths)
            },
            {
              label: "完税证明",
              value: this.clearAttaType(res.taxRecords),
              type: this.isType(res.taxRecords)
            },
            {
              label: "身体证复印件",
              value: this.clearAttaType(res.idcards),
              type: this.isType(res.idcards)
            },
          ];
          this.supplierSize = [
            { label: "面积", value: res.supScaleVo.measureArea },
            { label: "员工数量", value: res.supScaleVo.staffCount },
            { label: "高管数量", value: res.supScaleVo.managerCount },
            { label: "月度产能", value: res.supScaleVo.monthCapacity },
            {
              label: "主要生产设备",
              value: this.isProdDevice(res.supScaleVo.prodDeviceList)||''
            },
            {
              label: "主要检测设备",
              value: this.isProdDevice(res.supScaleVo.testDeviceList)||''
            }
          ];
          this.financialInformation = [
            { label: "开户行", value: supFinance.bankBranch },
            { label: "银行账户", value: supFinance.accountName },
            { label: "银行账号", value: supFinance.bankAccount },
            { label: "银行类别", value: supFinance.bankName },
            { label: "币种", value: supFinance.currency },
            { label: "是否境外", value: supFinance.isAbroad ? "是" : (supFinance.isAbroad==null) ? "-" : "否" },
          ];
          this.cooperationInformation = [
            { label: "供应商合作等级", value: res.coopType }, //合作等级：战略合作、长期合作、短期合作、一次性合作
            { label: "供应商风险等级", value: res.riskCategory }, ///风险等级，对应QMS供应商类别
            {
              label: "商品服务类型",
              value: res.goodsServiceType  
            },
            // { label: "合作账期", value: `${res.debtTerm ? res.debtTerm :  '-'}天` },
            { 
               label: "合作账期", 
               value: res.debtTerm ? `${res.debtTerm}天` : '-'
            },
            {
              label: "是否支持一件代发",
              value: res.isSupportRetailEc ? "是" : (res.isSupportRetailEc==null) ? "-":"否"
            },
          ];
          this.coopGoodsList = res.coopGoods;
        }).catch(res=>{
          console.error(res)
          this.basicInformation = [
            { label: "企业法人", value: ''},
            { label: "产权", value:''}, //产权：自由、租赁
            {
              label: "成立时间",
              value: ''
            },
            { label: "企业性质", value: ''}, //企业性质：外资、合资、民营、股份制、个人、其他
            { label: "主供商品", value: ''},
            { label: "经营品牌", value: ''},
            { label: "营业执照号", value:''},
            { label: "备注", value: '', border: true },
            {
              label: "是否一般纳税人",
              value:''
            },
            { label: "联系人", value: '' },
            { label: "职位", value: '' },
            { label: "电话", value: '' },
            { label: "传真", value: '' },
            { label: "邮箱", value: '' },
            { label: "单位地址", value: '', border: true },
            { label: "供应商编码", value: '' },
            { label: "供应商名称（中文）", value: ''},
            { label: "英文名称", value: ''},
            { label: "供应商简称", value: ''},
            { label: "曾用名", value: ''},
            { label: "国家", value: ''},
            // { label: "标签列表", value: this.clearTag(res.typeList) },
            {
              label: "供货分类",
              value: '',
            }, //：成品、配件、原料、其他
          // { label: "供应商产品分类", value: res.categorys },  //数组 分类要显示?
            { label:'供应商类型',value: ''},
            { label: "供应商产品分类", value: '' ,border: true}, 
            // { label: "客户类型", value: ''}, //客户类型：商超、电商、便利店、药妆店、其他
            { label: "主要业务类型", value: '' },
            { label: "主要客户名称", value: ''},
            { label: "主要客户类型",value: ''},
            { label: "供应商logo", value:'', type: 'img' },
            {
              label: "厂房/车间照片",
              value: '',
            },
            {
              label: "营业执照",
              value: ''
            }, // 字属性 fileName = label 文件名字,fileType 文件类型,attaUrl = url 文件地址,到时候写一个格式化的函数
            {
              label: "检验报告",
              value: ''
            },
            {
              label: "许可证",
              value:''
            },
            {
              label: "开户许可证",
              value: ''
            },
            {
              label: "组织架构图",
              value: ''
            },
            {
              label: "成功案例",
              value: ''
            },
            {
              label: "其他证照",
              value: ''
            },
            {
              label: "ISO认证",
              value: ''
            },{
              label: "CSR认证",
              value: ''
            },{
              label: "体系认证",
              value: ''
            },
            {
              label: "完税证明",
              value: ''
            }
          ];
          this.supplierSize = [
            { label: "面积", value: '' },
            { label: "员工数量", value: ''},
            { label: "高管数量", value: ''},
            { label: "月度产能", value:''},
            {
              label: "主要生产设备",
              value: ''
            },
            {
              label: "主要检测设备",
              value: ''
            }
          ];
          this.financialInformation = [
            { label: "开户行", value: ''},
            { label: "银行账户", value: ''},
            { label: "银行账号", value:''},
            { label: "银行类别", value:''},
            { label: "币种", value:''},
            { label: "是否境外", value:''},
          ];
          this.cooperationInformation = [
            { label: "供应商合作等级", value: ''}, //合作等级：战略合作、长期合作、短期合作、一次性合作
            { label: "供应商风险等级", value: '' }, ///风险等级，对应QMS供应商类别
            {
              label: "商品服务类型",
              value:''
            },
            { label: "合作账期", value: ''},
            {
              label: "是否支持一件代发",
              value: ''
            },
          ];
          this.coopGoodsList = res.coopGoods||[];
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    isProdDevice(data) {
      // 主要生产设备格式化
      // data = data.map(item=>item.filter(items=>items))
      // console.log(data,999);
      if (!data) return;
      if(data.length>0 && data[0].dev==null && data[0].count==null) return;
      let arr = [];
      data.forEach(item => {
        arr.push(`${item.dev}: ${item.count}`);
      });
      return arr.join(", ");
    },
    isType(item) {
      if (!item || item.length == 0) return "text";
      return [
        "png",
        "jpg",
        "jpeg",
        "bmp",
        "gif",
        "webp",
        "psd",
        "svg",
        "tiff"
      ].indexOf(item[0].fileType.toLowerCase()) !== -1
        ? "img"
        : "file";
    },
    //  清楚标签竖线
    clearTag(data) {
      try {
        if (Array.isArray(data)) {
          return data.join(", ");
        }
        return data
          .split("|")
          .filter(n => n)
          .join(", ");
      } catch {
        return;
      }
    },
    // 格式化附件对象
    clearAttaType(data) {
      if (!data && !Array.isArray(data) ) return;
      let arr = [];
      data.forEach(item => {
        arr.push({
          label: item.fileName,
          url: item.attaUrl
        });
      });
      return arr.length == 0?'-':arr;
    },
    getNullType(res){
      if(!res.customerType)return null;
      return res.customerType.indexOf('其他') ?` ${this.clearTag(res.customerType)} (${res.otherCustomerType})`: this.clearTag(res.customerType)
    },
    getName(res){
      let arr = [];
      let myName = [];
      res.typeList.forEach(item => {
        console.log(item);
        if(item == "1"){
          if(!res.categorys) return;
          res.categorys.forEach(items => {
            console.log(items.name);
            myName.push(items.name);
          });
        }
        if(item == "2"){
          if(!res.partsCategorys) return;
          res.partsCategorys.forEach(items => {
            console.log(items.name);

            myName.push(items.name);
          });
        }
      });
      return myName.join(', ');
    },
    // 初始化滑动-父盒子
    getSwiperInit() {
      let galleryThumbs = new Swiper(".gallery-thumbs", {
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        autoHeight: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        onSlideChangeEnd: function(galleryThumbs) {
          galleryThumbs.update(); //swiper更新
        }
      });
      let galleryTop = new Swiper(".gallery-top", {
        autoHeight: true,
        allowTouchMove: false, //阻止滑动
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        thumbs: {
          swiper: galleryThumbs
        },
        on: {
          slideChangeTransitionStart: () => {}
        },
        onSlideChangeEnd: function(galleryTop) {
          galleryTop.update(); //swiper更新
        }
      });
    },
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
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid white;
  overflow: hidden;
  margin: 0 auto;
  background: white;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}

// 总盒子
.galleryDiv {
  background: #f9f9f9;
  height: 1px;
  overflow: hidden;
  padding-bottom: 48px;
  ul {
    margin: 0 auto;
    background: white;
    background: rgba(255, 255, 255, 1);
    // box-shadow: 0px 2px 30px 0px rgba(58, 120, 239, 0.08);
    border-top: 10px solid #f9f9f9;
    border-bottom: 10px solid #f9f9f9;

    padding-top: 16px;
    li {
      width: 92%;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      padding-top: 12.8px;
      padding-bottom: 12.8px;
      span {
        display: inline-block;
        font-size: 15px;
        word-break: break-all;
        overflow: hidden;
      }
      span:nth-child(1) {
        width: 30%;
        color: #959ca7;
      }

      span:nth-child(2) {
        width: 70%;
      }
    }
  }
}
.swiper-slide-active {
  height: auto;
}
.swiper-slide-thumb-active {
  position: relative;
  color: #393c41 !important;
}
.swiper-slide-thumb-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0%;
  transform: translate(-50%);
  width: 30%;
  height: 10px;
  border-bottom: 3px solid #57b4b4;
  font-weight: 600;
}

// 按钮
.classification {
  text-align: left;
  margin-top: 25px;
  margin-bottom: 16px;
  display: flex;
  span {
    display: inline-block;
    letter-spacing: 2px;
    font-size: 15px;
    padding: 4px 3px 10px 3px;
    color: #707070;
    text-align: center;
    width: 25%;
    text-align: center;
  }
}
.Cooperation {
  background: #f9f9f9;
  .Cooperation_son {
    // background: white;
    div:nth-child(1) {
      height: 130px;
      margin-bottom: 20px;
      img {
        width: 130px;
        height: 130px;
      }
    }
    p {
      font-size: 13px;
      color: #262626;
    }
  }
}
</style>