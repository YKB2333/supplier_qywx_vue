<template>
  <div id="page">
    <div class="swiper-container banner-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in swipeImages" :key="index">
          <img :src="item.attaUrl" alt v-if="item.attaType == 2" class="w-h-full" />
          <video-player v-else :playsinline="true" :options="playerOptions" />
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination swiper-pagination-banner"></div>
    </div>
    <!-- 标题 -->
    <div class="p18 border-bottom10">
      <div>
        <p class="fw500 color-black break-word">{{spuModel.name}}</p>
        <p class="color-gray mt8 fs12 break-word">{{spuModel.productDescribe}}</p>
      </div>
      <div class="row l-h24 mt14">
        <div class="thisPrice">
          <div class="priceWapper ellipsis">
            <span class="color-red fw500 fs16 l-h24 ellipsis">{{ msrp || '~' }}</span>
            <span class="color-gray fs12">建议零售价</span>
          </div>
        </div>
        <div class="thisPrice" v-if="roleList.length > 0 && spuModel.supInfo">
          <div class="priceWapper ellipsis">
            <span class="color-red fw500 fs16 l-h24 ellipsis">{{ money || '~' }}</span>
            <span class="color-gray fs12">产品供货价</span>
          </div>
        </div>
        <!-- <div class="thisPrice" v-if="spuModel.supInfo.innerSupContacts && spuModel.supInfo.innerSupContacts.length>0">
          <div class="priceWapper ellipsis">
            <span class="fw500 fs14 l-h24 ellipsis">{{ spuModel.supInfo.innerSupContacts[0].fullName }}</span>
            <span class="color-gray fs12">内部联系人</span>
          </div>
        </div> -->
      </div>
    </div>
    <!-- 视屏 -->

    <!-- 内部联系人 -->
    <div class="p18 flex-1 border-bottom10" v-if="spuModel.wxCpUser">
      <p class="color-black fw500 border-bottom1 pb20">内部联系人</p>
      <div class="innerperson-wapper mt10">
        <div class="innerperson-avatar">
          <img :src="spuModel.wxCpUser.avatar || require('@/assets/images/defaultLogo.png')" />
        </div>
        <div class="innerperson-info">
          <p class="innerperson-name">{{ spuModel.oaUser && spuModel.oaUser.lastname }} <span>{{ spuModel.oaUser && spuModel.oaUser.mobile}}</span> </p>
          <p>{{ spuModel.oaUser && spuModel.oaUser.departmentname }}</p>
          <p v-if="spuModel.wxCpUser && spuModel.wxCpUser.userId" @click="openChart(spuModel.wxCpUser.userId)">联系TA</p>
        </div>
      </div>
    </div>

    <!-- 公司 -->
    <div class="row wpct92 p18 border-bottom10" v-if="roleList.length > 0 && spuModel.supInfo">
      <div class="w-h70 hidden" style="background:rgba(216,216,216,1);border-radius:8px;">
        <img
          :src="spuModel.supInfo.logo || require('@/assets/images/defaultLogo.png')"
          alt
          style="height:100%;object-fit: cover;"
        />
      </div>
      <div class="ml12 break-word flex-1 hidden">
        <p class="fw500 fs16 mb2">{{spuModel.supInfo.name}}</p>
        <p class="fs12 sm_button" v-if="spuModel.supTypeName">{{spuModel.supTypeName}}</p>
        <p class="fs12 color-gray mt6">供应商编码:{{spuModel.supInfo.code}}</p>
      </div>
    </div>

    <!-- 商品spu属性 -->
    <div class="p18 flex-1">
      <p class="color-black fw500 border-bottom1 pb20">商品SPU属性</p>
      <div v-for="(item,index) in spuDetails" :key="index">
        <div
          class="border-bottom1 ptb14 row fs14"
          v-if="item.isShow"
        >
          <p class="color-gray wpct30">{{ item.label }}</p>
          <div class="flex-1 break-word hidden">
            <span :class="['colro-black',{'sm_button':item.type == 'buttom'}]">{{ item.value || '~' }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <van-tabs v-if="skuDetails.length">
      <van-tab :title="sku.title" v-for="(sku, p_index) in skuDetails" :key="p_index">
        <div class="p18">
          <template v-for="(item) in sku.fields"  >
            <div
              :key="item.title"
              class="border-bottom1 ptb14 row fs14"
              v-if="!item.isHiden"
            >
              <p class="color-gray wpct30">{{ item.label }}</p>
              <div class="flex-1 break-word hidden">
                <span
                  :class="['colro-black',{'sm_button':item.type == 'buttom'}]"
                >{{ item.value || '~' }}</span>
              </div>
            </div>
          </template>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Swiper from "swiper";
import { getGoodsDetail,getCoopGoodsDetail } from "@/api/supplier";
import { role } from "@/const/supplier/role";

export default {
  name: "productDetails",
  components: {},
  data() {
    return {
      role,
      type: "", //商品类型
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 是否静音
        muted: false,
        // 视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: "auto",
        language: "zh-CN",
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: "16:9",
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [{ type: "video/mp4", src: "" }],
        // sources: this.fileList,
        //你的封面地址
        poster: "",
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      },
      money: "",//产品供货价
      msrp:"",//建议零售价
      swipeImages: [],
      spuDetails: [],
      skuDetails: [],
      productId: 0,
      spuModel: {
        supInfo: {}
      },
      roleList: [],
    };
  },
  computed: {},
  async created() {
    console.log('index create');
    console.log(this.$store.getters.roleList);
    this.roleList = JSON.parse(this.$store.getters.roleList)
    this.productId = this.$route.query.id;
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true
      });
      // 进入页面: 合作商品
      if( this.$route.query.type == "coop"){
        document.title = '合作商品详情'
        this.CoopHandleData()
      }else if( this.$route.query.type == "recommend"){// 进入页面: 推荐商品
        getGoodsDetail(this.productId).then(res => {
          document.title = '推荐商品详情'
          this.RecommendHandleData(res);
        }).catch(res=>{
          document.title = '推荐商品详情'
          this.spuDetails = [
        // {label:'合作状态',value:'合作中',type:"buttom"},
            {
              label: "产品类型",
              value: '',
              isShow: true
            },
            { label: "产品分类", value: '',isShow: true},
            { label: "品牌名", value: '' ,isShow: true},
            {
              label: "产品材质",
              value: '',
              isShow: true
            },
            {
              label: "包装方式",
              value:'',
              isShow: true
            },
            {
              label: "是否可定制",
              value: '',
              isShow: true
            },
            { label: "打样费", value: '' ,isShow: true},
            {
              label: "打样时长",
              value: '',
              isShow: true
            },
            { label: "已做渠道", value:'', isShow: true },
            { label: "保质期（天）", value: '', isShow: true },
            { label: "正常货期（天）", value: '', isShow: true }
          ];
        }).finally(()=>{
          this.$toast.clear()
        });
      }else{
        getGoodsDetail(this.productId).then(res => {
          document.title = '商品详情'
          this.RecommendHandleData(res);
        }).catch(res=>{
          document.title = '商品详情'
          this.spuDetails = [
        // {label:'合作状态',value:'合作中',type:"buttom"},
            {
              label: "产品类型",
              value: '',
              isShow: true
            },
            { label: "产品分类", value: '',isShow: true},
            { label: "品牌名", value: '' ,isShow: true},
            {
              label: "产品材质",
              value: '',
              isShow: true
            },
            {
              label: "包装方式",
              value:'',
              isShow: true
            },
            {
              label: "是否可定制",
              value: '',
              isShow: true
            },
            { label: "打样费", value: '' ,isShow: true},
            {
              label: "打样时长",
              value: '',
              isShow: true
            },
            { label: "已做渠道", value:'', isShow: true },
            { label: "保质期（天）", value: '', isShow: true },
            { label: "正常货期（天）", value: '', isShow: true }
          ];
        }).finally(()=>{
          this.$toast.clear()
        });
      }
    },
    // 推荐商品:获取的数据进行处理
    RecommendHandleData(res) {
      this.spuModel = res;
      this.spuDetails = [
        // {label:'合作状态',value:'合作中',type:"buttom"},
        {
          label: "产品类型",
          value: res.proTypeName,
          type: res.proTypeName?"buttom":'',
          isShow: true
        },
        { label: "产品分类", value: res.cateName, isShow: true },
        { label: "品牌名", value: res.brandName, isShow: true },
        {
          label: "产品材质",
          value: res.materialQuality,
          isShow: res.supType == 2
        },
        {
          label: "包装方式",
          value: res.packingMethod,
          isShow: res.supType == 2
        },
        {
          label: "是否可定制",
          value: res.isSupportOdm ? "是" : "否",
          isShow: res.supType == 2
        },
        { label: "打样费", value: res.proofingPrice, isShow: res.supType == 2 },
        {
          label: "打样时长",
          value: res.proofingCycle,
          isShow: res.supType == 2
        },
        { label: "已做渠道", value: res.salesChannels, isShow: true },
        { label: "保质期（天）", value: res.shelfLife, isShow: true },
        { label: "正常货期（天）", value: res.deliveryCycle, isShow: true }
      ];
      if (res.skus && res.skus.length) {
        res.skus.forEach((sku, index) => {
          this.skuDetails.push({
            title: `SKU-${index + 1}`,
            fields: [
              {
                label: "属性",
                value:
                  sku.secondAtbKey && sku.secondAtbValue
                    ? `${sku.firstAtbKey || "~"}:${sku.firstAtbValue ||
                        "~"};${sku.secondAtbKey || "~"}:${sku.secondAtbValue ||
                        "~"}`
                    : `${sku.firstAtbKey || "~"}:${sku.firstAtbValue || "~"}`
              },
              { label: "产品条码", value: sku.codeBar },
              { label: "批发打包规格", value: sku.wholesaleSpec },
              { label: "批发起订量", value: sku.wholesaleMinOrder },
              {
                label: "单品规格mm",
                value: this.filterNullSize(
                  sku.skuLength,
                  sku.skuWeight,
                  sku.skuHeight
                )
              },
              {
                label: "外箱规格mm",
                value: this.filterNullSize(
                  sku.highCartonSize,
                  sku.widthCartonSize,
                  sku.longCartonSize
                )
              },
              {
                label: "装箱规格mm",
                value: this.filterNullSize(
                  sku.boxLength,
                  sku.boxWeight,
                  sku.boxHeight
                )
              },
              {
                isHiden: !res.supInfo,
                label: `产品供货价`,
                value: this.roleList.length > 0 ? `¥${sku.price} (${
                  sku.isFreight ? "含运费" : "不含运费"
                } ${sku.isTax ? `含 ${sku.taxRate || 0} %税` : "不含税"})` : `¥ **`
              },
              { label: "建议零售价", value: `￥${sku.msrp || "~"}` }
            ]
          });
        });
        let money = res.skus.map(key => key.price);
        this.money =
          money.length == 1
            ? `¥${Math.max(...money)}`
            : `¥${Math.min(...money)}~¥${Math.max(...money)}`;
        let msrp = res.skus.map(key => key.msrp);
        this.msrp =
          msrp.length == 1
            ? `¥${Math.max(...msrp)}`
            : `¥${Math.min(...msrp)}~¥${Math.max(...msrp)}`;
      }
      if (res.titleImage) {
        this.swipeImages.unshift({ attaUrl: res.titleImage, attaType: "2" });
      }
      if (res.attaImages && res.attaImages.length) {
        let filterArray = res.attaImages.filter(item => item.attaType == 2);
        this.swipeImages = this.swipeImages.concat(filterArray);
      }
      if (res.videos && res.videos.length) {
        this.swipeImages.unshift(res.videos[0]);
        this.playerOptions.sources[0].src = res.videos[0].attaUrl;
      }
      this.$nextTick(res => {
        this.initSwiper();
      });
    },
    // 合作商品:获取的数据进行处理
    CoopHandleData(){
      let data = {
        supId:this.$route.query.supId,
        spuId:this.$route.query.id
      }
      getCoopGoodsDetail(data).then(res => {
        console.log(res);
        this.spuModel = res
        this.spuDetails = [
          {label:'商品名称',value:res.name, isShow: true},
          {label:'产品分类',value:res.cateName, isShow: true},
          {label:'品牌',value:res.brandName, isShow: true},
          {label:'产地',value:res.producePlace, isShow: true},
          {label:'保质期',value:res.shelfLife, isShow: true},
          {label:'零售单位',value:res.retailUnit, isShow: true},
          {label:'主属性',value: res.firstAtbKey, isShow: true},
          {label:'副属性',value: res.secondAtbKey, isShow: true},
        ]
        if(res.skus && res.skus.length){
          res.skus.forEach((sku,index) => {
            this.skuDetails.push({
              title: `SKU-${index+1}`,
              fields: [
                {label:'属性',value: sku.secondAtbKey && sku.secondAtbValue ? `${sku.firstAtbKey || '~'}:${sku.firstAtbValue || '~'};${sku.secondAtbKey || '~'}:${sku.secondAtbValue || '~'}` : `${sku.firstAtbKey || '~'}:${sku.firstAtbValue || '~'}`},
                {label:'产品条码',value:sku.codeBar},
                {label:'物料编码',value:sku.supplierGoodsCode},                       
                {label:'单品规格mm',value: this.filterNullSize(sku.skuLength,sku.skuWeight,sku.skuHeight)},
                {label:'外箱规格mm',value: this.filterNullSize(sku.highCartonSize,sku.widthCartonSize,sku.longCartonSize)},
                {label:'单品体积(立方米)',value: sku.unitvolume},
                {label:'外箱体积(立方米)',value: sku.cartonVolum},
                {label:'单品重量',value:sku.skuScale},
              ]
            })
          })
          // let money = res.skus.map(key=>key.price)
          // console.log(money);
          // this.money = money.length ==1 ? `¥${Math.max(...money)}` : `¥${Math.min(...money)}~¥${Math.max(...money)}`

        }
        if(res.titleImage){
          this.swipeImages.unshift({'attaUrl':res.titleImage,'attaType':"2"})
        }
        if(res.images && res.images.length){
            res.images.forEach(item => {
              this.swipeImages.unshift({'attaUrl':item.imagePath,'attaType':"2"})
            });
        }
        if(res.spuVideoAttachments && res.spuVideoAttachments.length){
              this.swipeImages.unshift({'attaUrl':res.spuVideoAttachments[0].attaUrl,'attaType':"2"})
              this.playerOptions.sources[0].src =  res.spuVideoAttachments[0].attaUrl

        }
        this.$nextTick(res=>{
          this.initSwiper()
        })
      }).catch(e=>{
        this.spuDetails = [
          {label:'商品名称',value:'', isShow: true},
          {label:'产品分类',value:'', isShow: true},
          {label:'品牌',value:'', isShow: true},
          {label:'产地',value:'', isShow: true},
          {label:'保质期',value:'', isShow: true},
          {label:'零售单位',value:'', isShow: true},
          {label:'主属性',value: '', isShow: true},
          {label:'副属性',value: '', isShow: true},
        ]
      }).finally(()=>{
        this.$toast.clear()
      })
    },
    // 格式尺寸
    filterNullSize(...value) {
      if (value.filter(key => key).length != value.length) return "";
      return `${value.join(" mm * ")} mm`;
    },
    initSwiper() {
      var bannerContainer = new Swiper(".banner-container", {
        slidesPerView: "auto",
        spaceBetween: "2.13%",
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      });
    },

    openChart(userId) {
      wx.openEnterpriseChat({
        userIds: userId, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        groupName: '', // 必填，会话名称。单聊时该参数传入空字符串""即可。
        success: function(res) {
          // 回调
        },
        fail: function(res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: #000000;
}
.color-black {
  color: #262626;
}
.color-gray {
  color: #707070;
}
.color-red {
  color: #ff3750;
}
.border-bottom10 {
  border-bottom: 10px solid #f9f9f9;
}
.border-bottom1 {
  border-bottom: 1px solid rgba(244, 244, 244, 1);
}
.sm_button {
  color: #57b4b4;
  border: 1px solid #57b4b4;
  border-radius: 4px;
  display: inline;
  padding: 0px 6px;
}
/deep/ .van-tabs__line {
  background-color: #57b4b4;
  width: 30px !important;
}
/deep/ .vjs-big-play-button {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.swiper-slide {
  height: 300px;
  overflow: hidden;
  img {
    object-fit: cover;
  }
}
/deep/ .vjs-fluid {
  height: 100%;
}
.video-player {
  height: 100%;
}
.break-word {
  overflow-wrap: break-word;
}
.thisPrice {
  display: flex;
  flex-direction: row;
  color: #666666;
  font-size: 11px;
  width: 33.33%;
  .priceWapper{
    display: flex;
    width: fit-content;
    flex-direction: column;
    span:nth-child(1) {
      font-weight: 500;
      font-size: 21px;
    }
    span:nth-child(2) {
      align-self: center;
      margin-top: 2px;
      color: #666666;
      font-size: 11px;
    }
  }
}


.innerperson-wapper{
  display: flex;
  align-content: center;
  align-items: center;
  text-align: left;
  overflow: hidden;
  position: relative;
  .innerperson-avatar {
    // width: 30%;
    width: 70px;
    height: 70px;
    border: 1px solid rgba(244, 244, 244, 1);
    overflow: hidden;
    position: relative;
    border-radius:50%;
    img {
      width:100%;
      height:100%;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius:50%;
      object-fit: cover;
      transform: translate(-50%, -50%);
    }
  }
  .innerperson-info {
    // width: 30%;
    margin-left: 12px;
    p {
      margin: 0;
      padding: 0;
    }
    .innerperson-name {
      color: #393c41;
      font-size: 18px;
      font-weight: 600;
      span {
        margin-left: 4px;
        font-size: 14px;
        color: rgba(0,0,0,.8);
        font-weight: 400;
      }
    }
    p:nth-child(2) {
      margin-top: 4%;
      color: #aeb3ba;
      font-size: 14px;
    }
    p:nth-child(3){
      position: absolute;
      right: 5%;
      top: 50%;
      transform: translate(0px,-50%);
      width:70px;
      height:30px;
      background:rgba(58,120,239,1);
      box-shadow:0px 2px 10px 0px rgba(58,120,239,0.43);
      border-radius:17px;
      line-height: 30px;
      text-align: center;
      color: white;
      font-size: 14px;
    }
  }
}  
</style>
