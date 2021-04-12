<template>
  <div id="home">
    <!-- 搜索 -->
    <van-sticky>
      <van-search
        :left-icon="require('@/assets/images/icon_search@2x.png')"
        :placeholder=" hasRole ? '请输入供应商名称/主营品牌/物料名称' : '请输入物料名称'"
        readonly
        @focus="onTagget"
      />
    </van-sticky>
    <!-- 轮播图 -->
    <div class="wpct92 mauto banner-container hidden">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="item in bannerList"
          :key="item.id"
          @click="$router.push({ path: 'newsdetails', query: { id: item.id} })"
        >
          <img :src="item.titleImage" />
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination swiper-pagination-banner"></div>
    </div>
    <!-- <van-swipe :autoplay="3000" indicator-color="white" class="wpct92 mauto">
      <van-swipe-item v-for="(item, index) in bannerList" :key="index" style="height:auto">
        <router-link :to="{path:'newsdetails', query: {id: item.id}}">
          <img :src="item.titleImage" class="w-h-full" />
        </router-link>
      </van-swipe-item>
    </van-swipe>-->

    <!-- 供应商入口 -->
    <van-grid
      :border="false"
      :column-num="4"
      class="wpct98 mauto mt10"
      v-if="roleList.includes('visitor_qywx_admin') || roleList.includes('visitor_qywx_depart_manager')"
    >
      <van-grid-item v-for="item in supplierList" :key="item.to" :to="item.to">
        <img :src="item.img" width="50" />
        <p class="fs13 mt10" style="color:#262626">{{ item.name }}</p>
      </van-grid-item>
    </van-grid>

    <!-- 供应商推荐新品  -->
    <BaseTitle title="供应商推荐新品" is-value icon is_link to="/latestnews?type=newProduct" class="mt10"></BaseTitle>
    <BaseImageList
      v-for="(item, index) in newProductList"
      :key="index"
      style="margin-bottom:24px;"
      type="right"
      is_link
      :to="{path: '/product/details/index', query: {id: item.id}}"
    >
      <template v-slot:title>
        <div style="color:#262626" class="mt10">
          <p class="fs16 fw600 ellipsis">{{ item.name }}</p>
          <p class="fs13 mt4 ellipsis" style="color:#AFAFAF">{{ item.supInfo && item.supInfo.name }}</p>
        </div>
        <div style="color:#AFAFAF" class="mt14">
          <span class="fs12">上新时间：{{ showRecentTime(item.createDate) }}</span>
        </div>
      </template>
      <template v-slot:img>
        <div class="w100 h100 col center-x hidden relative" style="background:#F9F9F9;">
          <img
            :src="require('@/assets/images/home/home_tag_new.png')"
            v-if="item.isNewProduct||item.isNewProduct==true"
            class="tag-img"
          />
          <img :src="item.titleImage" class="object-contain" style="width:100%;" />
        </div>
      </template>
    </BaseImageList>

    <!-- 供应商优质产品 -->
    <BaseTitle title="供应商优质产品" class="mt30" is-value>
      <template v-slot:value>
        <div class="swiper-pagination recommend-pagination"></div>
      </template>
    </BaseTitle>
    <div class="recommend-swiper mt8">
      <div class="swiper-wrapper">
        <div
          v-for="(item, index) in recommendList"
          class="swiper-slide"
          :key="index"
          @click="toGoodsDetail(item)"
        >
          <img :src="require('@/assets/images/home/home_tag_you.png')" class="tag-img" />
          <div class="w-h120 van-hairline--surround">
            <img :src="item.titleImage" class="w-h-full" />
          </div>
          <span class="ellipsis h18 fs14 mt14 wpct70">{{item.title}}</span>
          <span
            class="ellipsis h18 fs12 mt6"
            style="color:#AFAFAF"
            v-if="roleList.length > 0"
          >{{item.subhead}}</span>
        </div>
      </div>
    </div>

    <!-- 新增核心供应商 -->
    <template
      v-if="roleList.includes('visitor_qywx_admin') || roleList.includes('visitor_qywx_depart_manager')"
    >
      <BaseTitle title="新增核心供应商" class="mt20" is-value>
        <template v-slot:value>
          <div class="swiper-pagination supplier-pagination"></div>
        </template>
      </BaseTitle>
      <div class="supplier-swiper mt8">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in lastMonthCoreSup"
            :key="index"
            @click="item.id ? $router.push({path:'/detailsmessage', query: {id: item.id}}) : null"
            style="box-shadow: 0px 1px 5px 0px rgba(0, 72, 209, 0.08);"
          >
            <img :src="item.logo || require('@/assets/images/logo_transparent.png')" />
            <span class="ellipsis h18">{{item.name}}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 供应商最新资讯 -->
    <div class="mb14 mt26">
      <BaseTitle title="供应商最新资讯" />
      <van-row class="plr16 mt8" gutter="10">
        <van-col
          v-for="item in informationList"
          :key="item.to"
          span="12"
          @click="$router.push(item.to)"
        >
          <img class="wpct100" :src="item.img" />
        </van-col>
      </van-row>
    </div>

    <!-- 全球供应链资源 -->
    <BaseTitle title="全球供应链资源" class="mt28"></BaseTitle>
    <div class="plr14">
      <div style="box-shadow:0px 2px 11px 0px rgba(159,190,240,0.18);">
        <img
          :src="require('@/assets/images/slices/home_img_Japan.png')"
          @click="$router.push({path: '/sourcesupplier',query: {type:'JP'}})"
        />
        <div class="row ptb20" v-if="roleList.length > 0">
          <!-- <div class="flex-1 text-center fs13" style="border-right:1px solid #eee;" @click="$router.push({path: '/brandsupplier',query: {type:'JP'}})">厂商资源</div>
          <div class="flex-1 text-center fs13" @click="$router.push({path: '/brandsupplier',query: {type:'JP', sourceType:'market'}})">市场资讯资源</div>-->
          <div
            class="flex-1 text-center fs13"
            @click="$router.push({path: '/sourcesupplier',query: {type:'JP', sourceType:'market'}})"
          >最新日本供应链资讯</div>
          <div
            class="flex-1 text-center fs13"
            style="border-left:1px solid #eee;"
            @click="$router.push({path: '/sourcesupplier',query: {type:'JP'}})"
          >厂商资源</div>
        </div>
      </div>
    </div>

    <!-- 采购需求 -->
    <BaseTitle title="采购需求" class="mt28"></BaseTitle>
    <div
      class="one-generation"
      @click="$router.push({path: '/newmessage',query: {type:'purchase' }})"
    >
      <img :src="require('@/assets/images/slices/fqcgxq.png')" alt />
    </div>

    <!-- 经典案例分享  -->
    <BaseTitle
      title="经典案例分享"
      isValue
      icon
      is_link
      to="/latestnews?type=custCase"
      style="margin-top:28.8px"
    ></BaseTitle>
    <BaseImageList
      v-for="item in custCaseList"
      :key="item.id"
      style="margin-bottom:24px;"
      :title="item.title"
      :src="item.titleImage"
      :value="showCreateTime(item.createTimestamp)"
      type="right"
      is_link
      :to="{path:'newsdetails', query: {id:item.id}}"
    >
      <template v-slot:img>
        <div class="w120 h90 col center-x hidden l-h90" style="background:#F9F9F9;">
          <img :src="item.titleImage" class="w-full" />
        </div>
      </template>
    </BaseImageList>

    <!-- 采购业务工具 -->
    <div class="mb14">
      <BaseTitle title="采购业务工具" />
      <van-row class="plr16 mt8" gutter="10">
        <van-col span="12" @click="$router.push('/purchaseCourseList')">
          <img class="wpct100" :src="require('@/assets/images/slices/mine_img_stu.png')" />
        </van-col>
        <van-col span="12" @click="$router.push('/growthBook?type=2')">
          <img class="wpct100" :src="require('@/assets/images/slices/mine_img_pur.png')" />
        </van-col>
      </van-row>
    </div>

    <!--采购荣耀榜 -->
    <BaseTitle title="采购荣耀榜" class="mt20">
      <template v-slot:value>
        <div class="swiper-pagination HonorList-pagination"></div>
      </template>
    </BaseTitle>
    <div class="honor-swiper">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(item, index) in purchaserList"
          :key="item.id"
          @click="$router.push({name:'Purchaser', query: {id: item.id}})"
        >
          <img :src="item.titleImage" />
          <div>
            <p>{{item.title}}</p>
            <p>{{item.subhead}}</p>
          </div>
          <span>{{ index+1 }}</span>
        </div>
      </div>
    </div>

    <!-- 一件代发 -->
    <BaseTitle title="一件代发" icon is_link to="/message" style="margin-top:19px"></BaseTitle>
    <div
      class="one-generation mb30"
      @click="$router.push({name: 'OneGeneration', query: {id: onePkgModel.id}})"
    >
      <img :src="onePkgModel.titleImage" alt />
    </div>
    <!-- 版本弹窗 -->
    <div class="dialog-box">
      <van-dialog
        v-model="isShowDialog"
        :showConfirmButton="false"
        width="19em"
        class="fz-dialog"
        theme="round-button"
      >
        <img :src="require('@/assets/images/version.png')" class="w-full" />
        <div class="guide-wapper plr20 pb20 pt16">
          <div class="ellipsis title mb12">版本更新（{{versionName}}）</div>
          <div class="fs14 content">{{versionContent}}</div>
          <van-button
            class="mt22 fw600 h34"
            color="#3D93FF"
            round
            block
            @click="onjumpVersion"
          >{{versionUrl ? '查看详情' : '确定'}}</van-button>
          <!-- <div class="fs12 no-show-text" @click="onNeverShow">不在弹出</div> -->
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { getEcologyUserByWorkCode } from '@/api/index'
import {
  getCoopSuppliers,
  selectRecommendProductPage,
  searchPage
} from '@/api/supplier'
import { selectPage as cmsSelectPage } from '@/api/cmsInfo'
import { getLatestVersion, putLatestVersion } from '@/api/version'
import { isEmpty, showRecentTime, showCreateTime } from '@/utils'
import { savePosition } from '@/mixins'
import BaseTitle from '@/components/BaseTitle'
import BaseImageList from '@/components/BaseImageList'
import { cmsCategoryId } from '@/config'
import Swiper from 'swiper'
import { role } from '@/const/supplier/role'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    BaseTitle,
    BaseImageList
  },
  mixins: [new savePosition('home')],
  data() {
    return {
      role,
      bannerList: [], //轮播
      lastMonthCoreSup: [], //上月核心供应商
      onePkgModel: {}, //一件代发
      newsInfoList: [],
      newProductList: [],
      custCaseList: [],
      purchaserList: [],
      cooperationSupList: [],
      recommendList: [],
      supplierList: [
        {
          name: '品牌供应商',
          to: '/brandsupplier?type=brand',
          img: require('@/assets/images/slices/home_icon_brand.png')
        },
        {
          name: 'ODM供应商',
          to: '/find?type=ODM',
          img: require('@/assets/images/slices/home_icon_ODM.png')
        },
        {
          name: 'OEM供应商',
          to: '/find?type=OEM',
          img: require('@/assets/images/slices/home_icon_OEM.png')
        },
        {
          name: '配件供应商',
          to: '/find?type=accessory',
          img: require('@/assets/images/slices/home_icon_acc.png')
        }
      ],
      informationList: [
        {
          name: '最近资讯',
          to: '/latestnews?type=newest',
          img: require('@/assets/images/slices/home_img_info.png')
        },
        {
          name: '行业资源共享',
          to: '/shareList',
          img: require('@/assets/images/slices/home_img_res.png')
        }
      ],
      goodsQuery: {
        pageIndex: 1,
        pageSize: 3,
        proType: '',
        name: '',
        isOnSale: true,
        orderStr: 'checkedDate desc ,createDate desc'
      },
      isShowDialog: false,
      versionName: '', //版本标题
      versionContent: '', //版本内容
      versionUrl: '' //版本链接
    }
  },
  computed: {
    ...mapGetters({
      roleArrStr: 'roleList'
    }),
    roleList() {
      return JSON.parse(this.roleArrStr)
    },
    hasRole() {
      return Array.isArray(this.roleList) && this.roleList.length > 0
    }
  },
  async created() {
    this.$toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true
    })
    this.fetchLatestVersion()
    await this.fetchActivityBannerData()
    this.fetchLastMonthCoreSup()
    this.fetchOnePkgData()
    this.fetchNewsInfoData()
    this.fetchNewProductData()
    this.fetchCustCaseData()
    this.fetchPurchaserData()
    this.fetchCoopSuppliers()
    this.fetchRecommendList()
  },
  methods: {
    showCreateTime,

    showRecentTime,
    //获得上月的开始时间和结束时间
    getMonthTime(myMonth) {
      var now = new Date() //当前日期
      var nowMonth = now.getMonth() //当前月
      var nowYear = now.getFullYear() //当前年
      //  console.log(nowYear,nowMonth,this.getMonthDays(now.getMonth()))
      var monthEndDate = new Date(
        nowYear,
        now.getMonth() - 1,
        this.getMonthDays(now.getMonth() - 1)
      )
      var monthStartDate = new Date(nowYear, now.getMonth() - 1, 1)
      return {
        monthStartDate: monthStartDate.getTime(),
        monthEndDate: monthEndDate.getTime()
      }
    },
    //获取版本更新信息
    fetchLatestVersion() {
      getLatestVersion().then((res) => {
        let isVersionState = sessionStorage.getItem('isVersion')
        if (isVersionState || !res) {
          this.isShowDialog = false
          return
        }
        this.isShowDialog = true
        this.versionName = res.name
        this.versionContent = res.updateContent
        this.versionUrl = res.updatePushUrl
      })
    },
    //获得某月的天数
    getMonthDays(myMonth) {
      let now = new Date()
      let nowYear = now.getYear() //当前年
      let monthStartDate = new Date(nowYear, myMonth, 1)
      let monthEndDate = new Date(nowYear, myMonth + 1, 1)
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      return days
    },

    fetchActivityBannerData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 3,
        infoCategoryId: cmsCategoryId.banner,
        status: '1',
        // isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      })
        .then((res) => {
          this.bannerList = res.records
          this.$nextTick(() => {
            this.initBannerSwiper()
          })
          // console.log('轮播图', this.bannerList)
        })
        .finally(() => {
          this.$toast.clear()
        })
    },

    fetchLastMonthCoreSup() {
      return searchPage({
        pageIndex: 1,
        pageSize: 10,
        // createDateStart:this.getMonthTime().monthStartDate,
        // createDateEnd:this.getMonthTime().monthEndDate,
        orderType: '1',
        orderProperty: 'createDate'
      })
        .then((res) => {
          this.lastMonthCoreSup = res.list
          // console.log("1111",this.lastMonthCoreSup)
          this.$nextTick(() => {
            this.getSupplierSwiper() // 上月新增核心供应商
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },

    fetchOnePkgData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 1,
        infoCategoryId: cmsCategoryId.onePkg,
        status: '1',
        // isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        this.onePkgModel = res.records[0] || {}
      })
    },

    fetchNewsInfoData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 4,
        infoCategoryId: cmsCategoryId.newsInfo,
        status: '1',
        // isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        this.newsInfoList = res.records
        // console.log('最新资讯', this.newsInfoList)
      })
    },

    fetchNewProductData() {
      return selectRecommendProductPage(this.goodsQuery).then((res) => {
        this.newProductList = res.records
        // console.log('新增产品', this.newProductList)
      })
    },

    fetchCustCaseData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 4,
        infoCategoryId: cmsCategoryId.custCase,
        status: '1',
        // isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        this.custCaseList = res.records
        // console.log('经典案例分享', this.custCaseList)
      })
    },

    fetchPurchaserData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 10,
        infoCategoryId: cmsCategoryId.purchaser,
        status: '1',
        // isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        if (res && res.total > 0) {
          this.purchaserList = res.records
          // console.log('采购荣耀榜', this.purchaserList)
          this.purchaserList.forEach((item) => {
            if (!isEmpty(item.source)) {
              getEcologyUserByWorkCode(item.source).then((ecologyUser) => {
                if (ecologyUser) item.title = ecologyUser.lastname
                if (ecologyUser) item.subhead = ecologyUser.departmentname
              })
            }
          })
        }
        this.$nextTick(() => {
          this.getHonorListSwiper() // 采购荣耀榜
        })
      })
    },

    fetchCoopSuppliers() {
      getCoopSuppliers().then((res) => {
        this.cooperationSupList = res.records
      })
    },

    fetchRecommendList() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 8,
        infoCategoryId: cmsCategoryId.recommend,
        status: '1',
        // isRecommend: true,
        orderStr: 'orderLevel desc, pubTimestamp desc, createTimestamp desc'
      }).then((res) => {
        // console.log({res});
        this.recommendList = res.records
        this.$nextTick(() => {
          this.getRecommendSwiper() // 供应商新品推荐
        })
      })
    },
    //banner
    initBannerSwiper() {
      var bannerContainer = new Swiper('.banner-container', {
        slidesPerView: 'auto',
        spaceBetween: '2.13%',
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    },
    // 供应商新品推荐
    getRecommendSwiper() {
      var swiper = new Swiper('.recommend-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        slidesPerColumn: 1,
        // freeMode : true,
        pagination: {
          el: '.recommend-pagination',
          type: 'fraction',
          renderFraction: (currentClass, totalClass) => {
            return `<span class="${currentClass}"></span> / <span>${this.recommendList.length}</span>`
          }
        }
      })
    },
    // 上月新增核心供应商
    getSupplierSwiper() {
      var swiper = new Swiper('.supplier-swiper', {
        slidesPerView: 4,
        spaceBetween: 10,
        slidesPerColumn: 1,
        // freeMode : true,
        pagination: {
          el: '.supplier-pagination',
          type: 'fraction',
          renderFraction: (currentClass, totalClass) => {
            return `<span class="${currentClass}"></span> / <span>${this.lastMonthCoreSup.length}</span>`
          }
        }
      })
    },
    // 采购荣耀榜
    getHonorListSwiper() {
      var swiper = new Swiper('.honor-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        pagination: {
          el: '.HonorList-pagination',
          type: 'fraction',
          renderFraction: (currentClass, totalClass) => {
            return `<span class="${currentClass}"></span> / <span>${this.purchaserList.length}</span>`
          }
        }
      })
    },

    onTagget() {
      // this.$router.push({
      //   path: '/find',
      //   query: { type: 'search' }
      // })
      this.$router.push({
        path: '/search-supplier',
        query: {
          type: this.hasRole ? 0 : 1
        }
      })
    },

    onjumpVersion() {
      putLatestVersion({ sys: 'customer' }).then((res) => {
        sessionStorage.setItem('isVersion', true)
        this.onCloseDialog()
        if (this.versionUrl) {
          window.location.href = this.versionUrl
        }
      })
    },

    onCloseDialog() {
      this.isShowDialog = false
    },

    toGoodsDetail(item) {
      if (item.source) {
        this.$router.push({
          name: 'productDetails',
          query: { id: item.source }
        })
      } else {
        this.$toast('推荐物料已下架或不存在')
      }
    }
  },
  destroyed() {
    this.$toast.clear()
  }
}
</script>

<style lang="scss" scoped>
#home {
  height: 100vh;
  padding-bottom: 50px;
  overflow-x: hidden;
  background: white;
}
.dialog-box {
  font-size: 37.5px;
}
// 一件代发
.one-generation {
  padding-top: 6px;
  text-align: center;
  img {
    width: 92%;
  }
}

// 上个月新增供应商
.supplier-swiper {
  width: 92%;
  margin: 0 auto;
}
.banner-container {
  position: relative;
  /deep/ .swiper-pagination-current {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 18px;
  }
  /deep/ .swiper-pagination-bullet-active {
    background: white !important;
  }
}
.recommend-pagination,
.supplier-pagination,
.HonorList-pagination {
  position: inherit !important;
  font-size: 12px;
  /deep/ .swiper-pagination-current {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 18px;
  }
}
.supplier-swiper {
  .swiper-slide {
    // background: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 4px;
    width: 80px !important;
    height: 80px !important;
    img {
      width: 50px;
      height: 24px;
      margin-top: 26%;
      object-fit: cover;
    }
    span {
      color: #333333;
      font-size: 12px;
      margin-top: 8px;
      margin-bottom: 10%;
      width: 100%;
      padding: 0 4px;
    }
  }
}

// 蔡荣荣誉榜
.honor-swiper {
  width: 92%;
  margin: 0 auto;
  margin-top: 8px;
  .swiper-slide {
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 150px;
    position: relative;
    img {
      width: 150px;
      height: 180px;
      object-fit: cover;
    }
    div {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 45px;
      background: rgba(0, 0, 0, 0.36);
      text-align: center;
      p {
        color: white;
        font-size: 15px;
        color: #f5f5f5;
      }
      p:nth-child(1) {
        margin-top: 4px;
      }
      p:last-child {
        font-size: 12px;
      }
    }
    span {
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      background: black;
      text-align: center;
      color: white;
      font-size: 12px;
      line-height: 18px;
    }
  }
}
/deep/ .fz-dialog {
  border-radius: 8px;
  // padding: 20px;
  // padding-bottom: 5px;
  background-color: transparent;
  .guide-wapper {
    position: relative;
    text-align: justify;
    transform: translateY(-1px);
    white-space: pre-line;
    background-color: #fff;
    .close-btn {
      position: absolute;
      right: 0px;
      transform: translate(25%, -25%);
    }
    .title {
      font-weight: bold;
      color: #121314;
      line-height: 20px;
      font-size: 16px;
    }
    .content {
      // font-weight: 500;
      color: #666666;
      line-height: 22px;
      font-size: 14px;
    }
  }
  .van-goods-action.van-dialog__footer {
    display: none;
  }
  .no-show-text {
    color: rgba(102, 102, 102, 0.6);
    margin: 8px 0;
    float: right;
  }
}
// 合作供应商
.Cooperation {
  width: 109px;
  height: 66px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  img {
    width: 109px;
    height: 58px;
  }
}
.recommend-swiper {
  width: 92%;
  margin: 0 auto;
  .swiper-slide {
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-right: 10px;
    span {
      width: 80%;
      text-align: center;
    }
  }
}
.tag-img {
  position: absolute;
  top: 0;
  left: 8px;
  width: 20px;
  height: 23px;
  z-index: 2;
}
/deep/ .van-search__content {
  border-radius: 30px;
}
/deep/ .van-field__left-icon {
  display: flex;
}
/deep/ .van-icon {
  display: flex;
  align-items: center;
}
</style>
