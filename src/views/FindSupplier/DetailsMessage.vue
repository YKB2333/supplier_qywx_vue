<template>
  <div>
    <div class="clientBorderBottom">
      <div class="clientHead mt20 wpct90 mauto hidden">
        <BaseImageList :src="logo" type="right" imgClass="w76 h76" imgClassSon="pos-center" parent_Class="wpct100 ">
          <template v-slot:title>
            <div class="Header_box">
              <p class="fs16 fw500 ellipsis2">{{supplier.name}}</p>
            </div>
            <div style="color:#AFAFAF" class="mt6">
              <van-tag
                color="#ebf5f5"
                text-color="#57B4B4"
                class="fs13"
                size="medium"
              >供应商分类: {{supplier.type}}</van-tag>
            </div>
            <div class="mt6">
              <img
                :src="require( isEmpty(supplier.isos)  ? '@/assets/images/slices/detail_icon_iso_nor.png' :'@/assets/images/slices/detail_icon_iso.png')"
                class="mr6"
              />
              <img
                :src="require( isEmpty(supplier.csrs)? '@/assets/images/slices/detail_icon_csr_nor.png' :  '@/assets/images/slices/detail_icon_csr.png' )"
              />
            </div>
          </template>
        </BaseImageList>
        <p class="fs14 pt18 row" style="color:#AFAFAF">
          <span class="w108">供应商状态</span>
          <span style="color:#707070">{{ supplier.checkedStatus == '1' && !supplier.code ? '临时供应商':"合格供应商" }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108" style="flex: none;">经营品牌</span>
          <span style="color:#707070">{{ supplier.manageBrank }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">主营商品</span>
          <span style="color:#707070">{{ supplier.mainProduct }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">合作客户</span>
          <span style="color:#707070">{{ supplier.customerName }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">联系人</span>
          <span style="color:#707070" >{{ supplier.supContacts && supplier.supContacts[0] && supplier.supContacts[0].fullName }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">联系电话</span>
          <span style="color:#707070" >{{ supplier.supContacts && supplier.supContacts[0] && supplier.supContacts[0].mobile }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">联系人(内部)</span>
          <span style="color:#707070" >{{ supplier.innerSupContacts && supplier.innerSupContacts[0] && supplier.innerSupContacts[0].fullName }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">联系电话(内部)</span>
          <span style="color:#707070" >{{ supplier.innerSupContacts && supplier.innerSupContacts[0] && supplier.innerSupContacts[0].tel }}</span>
        </p>
        <p class="fs14 pt10 row" style="color:#AFAFAF">
          <span class="w108">所属部门(内部)</span>
          <span style="color:#707070" >{{ supplier.innerSupContacts && supplier.innerSupContacts[0] && supplier.innerSupContacts[0].deptName }}</span>
        </p>

        <div class="mtb16" v-if="supplier.country == '日本'">
          <img src="@/assets/images/slices/detail_icon_sym@2x.png" alt class="w20" />
          <p class="fs14 ptb6 l-h22" style="color:#57B4B4">可合作优势: {{ supplier.intro}}</p>
          <span class="w24 mt4" style="height:3px;display:block;background:#e5e5e5"></span>
        </div>
        <div class="mtb16" v-else>
          <img src="@/assets/images/slices/detail_icon_sym@2x.png" alt class="w20" />
          <p class="fs14 ptb6 l-h22" style="color:#57B4B4">{{ supplier.intro}}</p>
          <span class="w24 mt4" style="height:3px;display:block;background:#e5e5e5"></span>
        </div>
      </div>

      <div class="row flex-start center-y wpct92 mauto mb20 mt12">
        <img src="@/assets/images/slices/detail_icon_map.png" class="w16 h16 mr6" alt />
        <span class="fs14" style="color:#707070">{{ supplier.address }}</span>
      </div>
    </div>
    <div class="clientBorderBottom pb10">
      <div v-if="Array.isArray(supplier.coopGoods) && supplier.coopGoods.length">
        <BaseTitle
          title="合作产品"
          icon
          is_link
          :to="{path:'/attrdetailist',query:{array:JSON.stringify(supplier.coopGoods),type:'coop',supId: supplierId,}}"
          :isValue="supplier.coopGoods.length>3"
        ></BaseTitle>
        <van-grid :column-num="3" :border="false" class="wpct100" style="margin-top:-15px;">
          <van-grid-item
            v-for="(item,index) in  supplier.coopGoods.slice(0,3)"
            :key="index"
            @click="$router.push({name:'productDetails',query:{id:item.id,supId: supplierId,type:'coop'}})"
          >
            <div class="bestSeller">
              <img :src=" item.titleImage||defaultLogo" alt />
            </div>
            <p class="ellipsis mt10 wpct70 fs13 text-center" style="color:#393C41">{{ item.name }}</p>
          </van-grid-item>
        </van-grid>
      </div>
      <div v-else>
        <BaseTitle
          title="合作产品"
          icon
          is_link
          :is-emply="infoList&&infoList.length===0"
          :emply-type="'img'"
        ></BaseTitle>
      </div>
    </div>
    <div class="clientBorderBottom pb10">
      <div v-if="Array.isArray(supplier.recommendProducts) && supplier.recommendProducts.length">
        <BaseTitle
          title="推荐产品"
          icon
          is_link
          :to="{path:'/attrdetailist',query:{array:JSON.stringify(supplier.recommendProducts),type:'recommend'}}"
          :isValue="supplier.recommendProducts.length>1"
        ></BaseTitle>
        <van-grid :column-num="3" :border="false" class="wpct100" style="margin-top:-15px;">
          <van-grid-item
            v-for="(item,index) in supplier.recommendProducts.slice(0,3)"
            :key="index"
            @click="$router.push({name:'productDetails',query:{id:item.id,type:'recommend'}})"
          >
            <div class="bestSeller">
              <img :src="item.titleImage || defaultLogo" alt />
            </div>
            <p class="ellipsis mt10 wpct70 fs13 text-center" style="color:#393C41">{{ item.name}}</p>
          </van-grid-item>
        </van-grid>
      </div>
      <div v-else>
        <BaseTitle
          title="推荐产品"
          icon
          is_link
          :is-emply="infoList&&infoList.length===0"
          :emply-type="'img'"
        ></BaseTitle>
      </div>
    </div>
    <div class="clientBorderBottom pb10">
      <div v-if="Array.isArray(supplier.successCases) && supplier.successCases.length">
        <BaseTitle
          title="供应商成功案例"
          icon
          is_link
          :to="{path:'/attrdetailist',query:{array:JSON.stringify(supplier.successCases),type:'success'}}"
          :isValue=" supplier.successCases.length>3"
        ></BaseTitle>
        <div class="plr14 pb2">
          <atta-item
            style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
            v-for="(item, index) in supplier.successCases.slice(0,3)"
            :key="index"
            :file-name="item.fileName"
            :file-type="item.fileType"
            :size="item.size"
            :attaUrl="item.attaUrl"
          />
        </div>
      </div>
      <div v-else>
        <BaseTitle
          title="供应商成功案例"
          icon
          is_link
          :is-emply="infoList&&infoList.length===0"
          :emply-type="'img'"
        ></BaseTitle>
      </div>
    </div>

    <div class="clientBorderBottom pb10">
      <div v-if="Array.isArray(infoList) && infoList.length">
        <BaseTitle
          title="供应商资讯"
          icon
          is_link
          :to="{path:'/infoDetailList',query:{ id: this.$route.query.id }}"
          :isValue="infoCount>2"
        ></BaseTitle>
        <div class="plr14 pb2">
          <div
            class="ptb24 row space-between wpct92 mauto van-hairline--bottom "
            v-for="(item_list,list_index) in infoList"
            :key="list_index"
            @click="$router.push({path:'/newsdetails',query: {id: item_list.id}})"
          >
            <img :src="item_list.titleImage || require('@/assets/images/logo.png')"  width="109" height="109" class="object-contain">
            <div class="flex-1 ml12 col " style="overflow: hidden;justify-content: center;" >
              <p class="fs16 l-h21 mb10 mt2 ellipsis2">{{ item_list.title }}</p>
              <p class="fs12 fw400 l-h17 mt14" style="color: #999999;">
                {{ format( item_list.createTimestamp ) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <BaseTitle
          title="供应商资讯"
          icon
          is_link
          :is-emply="infoList&&infoList.length===0"
          :emply-type="'img'"
        ></BaseTitle>
      </div>
    </div>

    <div v-if="supplier.id" class="one-generation" @click="$router.push({path: '/supplierdetails',query: {id:supplier.id }})">
      <img src="@/assets/images/slices/detail_img_int.png" alt />
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import { searchInfoPage  } from "@/api/supplier";
import { getSupTypes, getSupDetail } from "@/api/supplier";
import BaseImageList from "@/components/BaseImageList";
import BaseTitle from "@/components/BaseTitle";
import AttaItem from "@/components/AttachmentItem";
import { isEmpty } from "@/utils";

export default {
  name: "DetailsMessage",
  components: {
    BaseImageList,
    BaseTitle,
    AttaItem
  },
  data() {
    return {
      infoList: [],
      infoCount: 0,
      defaultLogo: require("@/assets/images/defaultLogo.png"),
      supplier: {},
      supTypes: [],
      supplierId:'',
    };
  },
  computed: {
    logo() {
      if (this.supplier.logo) return this.supplier.logo;
      return this.defaultLogo;
    }
  },
  methods: {
    format(date) {
      if (!date) {
        return ''
      }
      return formatDate( date, 'Y年M月D日' )
    },
    isEmpty,
    async fetchSupTypes() {
      await getSupTypes().then(res => {
        res.forEach(e => {
          this.supTypes[e.code] = e.text;
        });
      });
    },
    fetchSupInfoData() {
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
       getSupDetail(this.$route.query.id)
        .then(res => {
          this.supplier = res;
          this.supplier["type"] = res.typeList
            .map(type => {
              return this.supTypes[type];
            })
            .join(",");
        })
        .finally(()=>{
          this.$toast.clear()
        })
    },
  },

  async created() {
    this.$nextTick(() => {
      //获取上级路由
      if(this.beforeUrl === '/search-supplier') {
        window.scrollTo(0,0)
      }
    })
    this.supplierId = this.$route.query.id
    this.fetchSupTypes();
    this.fetchSupInfoData(); // 获取供应商信息
    searchInfoPage({cmsInfoType: '', pageIndex: 1, pageSize: 2, supplierId:  this.supplierId, orderStr: 'createTimestamp desc'}).then(res => {
      this.infoList = res && res.records || []
      this.infoCount = res && res.total || 0
    })
  },
  mounted() {},
  destroyed() {},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.beforeUrl = from.path
    })
  },
};
</script>

<style lang="scss" scoped>
.clientBorderBottom {
  border-bottom: 15px solid #f3f4f9;
}
.clientTitle {
  font-weight: 500;
  color: rgba(57, 60, 65, 1);
  line-height: 15px;
}
.hotList {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
  border-radius: 5px;
  // overflow: hidden;
  position: relative;
}
.clientTag {
  position: absolute;
  left: 0;
  top: 0;
  width: 22px;
  height: 24.5;
}
.weekSales {
  .weekSalesSon {
    margin-top: 14px;
    margin-bottom: 14px;
    width: 50%;
    position: relative;

    div:nth-child(1) {
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      position: relative;

      img {
        // position: absolute;
        // left: 0%;
        // top: 50%;
        // transform: translate(0%,-50%);
        width: 8px;
        height: 9px;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        margin-right: 10px;
      }
      p {
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 1px;
        color: rgba(58, 120, 239, 1);
        margin-right: 15px;
        // line-height:15px;
      }
    }
    p:nth-child(2) {
      font-size: 12px;
      font-weight: 500;
      color: rgba(149, 156, 167, 1);
      letter-spacing: 1px;
      margin-top: 10px;
    }
  }
}

.correlation {
  width: 92%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  .correlationSon {
    position: relative;
    width: 49%;
    box-sizing: border-box;
    overflow: hidden;

    .correlationSonDiv {
      font-size: 14px;
      color: white;
      width: 100%;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 38px;
        margin-right: 7px;
      }
    }
  }
}
.clientBase {
  position: relative;
  .clientBaseSon {
    font-size: 14px;
    color: white;
    position: absolute;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 38px;
      margin-right: 7px;
    }
  }
}
.client_box_shaodow {
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
}
.kernelProject {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
  border-radius: 5px;
  text-align: center;
  height: 45px;
  line-height: 45px;
  align-items: center;
  width: 92%;
  margin: 0 auto;
  margin-bottom: 15px;
  span {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #6b7178;
    line-height: 15px;
  }
  span:last-child {
    text-align: right;
    margin-right: 10px;
    color: #959ca7;
  }
}
.aim {
  background: #3a78ef;
  width: 6px;
  height: 6px;
  display: block;
  position: relative;
  margin-left: 10px;
  margin-right: 8px;
  border-radius: 50%;
}

.bestSeller {
  width: 106px;
  height: 106px;
  overflow: hidden;
  border: 1px solid rgba(235, 237, 242, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  // img {
  //   width: 68px;
  //   height: 68px;
  // }
}

.Header_box {
  position: relative;
  width: 100%;
  .Header_son {
    position: absolute;
    right: 0;
    top: 10px;
    font-size: 12px;
    color: white;
    background: #3a78ef;
    border-radius: 3px;
    width: 60px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: 3px;
    }
  }
}
.isCollect {
  background: #c8cbd2 !important;
}
/deep/ .van-grid {
  width: 98%;
  margin: 0 auto;
}
/deep/ .van-grid-item__content {
  padding: 16px 0px !important;
}
/deep/ .van-grid-item {
  width: 33%;
}
.cooperation_box {
  position: relative;
  width: 49%;
  margin-bottom: 2%;
  .cooperation_son {
    position: absolute;
    left: 15%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
    span {
      display: block;
      color: white;
      font-weight: 600;
      font-size: 20px;
    }
  }
}

.one-generation {
  padding-top: 24px;
  padding-bottom: 24px;
  text-align: center;
  img {
    width: 92%;
  }
}
</style>
