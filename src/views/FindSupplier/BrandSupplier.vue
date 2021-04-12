<template>
  <div class="page" id="brandsupplier-scroll">
    <div v-if="vendorBrand">
      <img :src="vendorBrand[0].titleImage" />
    </div>
    <!-- 供应商主体 -->
    <van-sticky>
      <div class="gallery-thumbs wpct92 mauto hidden border-bottom">
        <div class="swiper-wrapper classification">
          <!-- 点击切换总的标题 -->
          <span
            class="swiper-slide"
            v-for="(item,index) in title"
            :key="item.id"
            @click="getSupplier(item,index)"
          >{{ item.name }}</span>
        </div>
      </div>
    </van-sticky>

    <div class="gallery-top">
      <div class="swiper-wrapper heightAuto">
        <div class="swiper-slide galleryDiv" v-for="item in title" :key="item.id">
          <div class="SubpplierBtn" v-if="$route.query.type == 'JP' && item.name == '厂商资源'">
            <span
              v-for="(typeItem, typeIndex) in typelist"
              :key="typeItem.queryType"
              @click="getActive(typeItem, typeIndex)"
              :class="{'SubpplierBtnActive': typeIndex == ActiveIndex}"
            >{{ typeItem.name }}</span>
          </div>
          <div class="SubpplierBtn" v-if="$route.query.type == 'JP' && item.name == '最新日本供应链资讯'" v-show="roleList.length > 0">
            <span
              v-for="(typeItem, typeIndex) in newsTypeList"
              :key="typeItem.queryType"
              @click="getActive1(typeItem, typeIndex)"
              :class="{'SubpplierBtnActive': typeIndex == ActiveIndex1}"
            >{{ typeItem.name }}</span>
          </div>
          <!-- 加载更多 -->
          <BaseDefaultNull :show='!list.length'></BaseDefaultNull>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false">
            <div v-if="$route.query.type == 'JP' && currentTitleIndex === 0">
              <div
                class="ptb24 row space-between wpct92 mauto van-hairline--bottom "
                :class="{ 'van-hairline--top' : !list_index }"
                v-for="(item_list,list_index) in list"
                :key="list_index"
                @click="$router.push({path:'/newsdetails',query: {id: item_list.id}})"
              >
                <img :src="item_list.titleImage || require('@/assets/images/logo.png')"  width="109" height="109" class="object-contain" >
                <div class="flex-1 ml12 col " style="overflow: hidden;justify-content: center;" >
                  <p class="fs16 l-h21 mb10 mt2 ellipsis2">{{ item_list.title }}</p>
                  <p v-if="item_list.supplierName" class="ellipsis">
                    <span class="ptb4 plr6 fs14 fw500 " style=" line-height: 14px;background-color:rgba(87, 180, 180, .1);border-radius: 1px;">
                      <span style="color: #57B4B4;">
                        {{ item_list.supplierName }}
                      </span>
                    </span>
                  </p>
                  <p class="fs12 fw400 l-h17 mt14" style="color: #999999;">
                    {{ format( item_list.createTimestamp )  }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <van-grid :column-num="2" border square>
                <van-grid-item
                  v-for="(item_list,list_index) in list"
                  :key="list_index"
                  @click="$router.push({path:'/detailsmessage',query: {id: item_list.id}})">
                  <div slot="icon" class="w64 h64 relative">
                    <img :src="item_list.logo || require('@/assets/images/logo.png')" class="pos-center" style="max-width: 100%;max-height: 100%;"/>
                  </div>
                  <div slot="text" class="mt20 plr20 h42">
                    <span slot="text" class="fs15 text-center ellipsis2">{{ item_list.name }}</span>
                  </div>
                </van-grid-item>
              </van-grid>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import { selectPage as cmsSelectPage } from "@/api/cmsInfo";
import { searchPage, searchInfoPage } from "@/api/supplier";
import { cmsCategoryId } from "@/config";
import BaseDefaultNull from "@/components/BaseDefaultNull";
import Swiper from "swiper";
import { role } from "@/const/supplier/role";
import { savePosition }  from '@/mixins'

export default {
  name: "BrandSupplier",
  components: { BaseDefaultNull },
  mixins: [new savePosition('brandsupplier-scroll')],
  data() {
    return {
      role,
      supTypes: {},
      supplierMsg: [], //供应商信息
      supInfo: {},
      currentTitleIndex: 0,
      title: [],
      pageTitle: [
        { id: 1, name: "NB供应商" },
        { id: 3, name: "PB供应商" },
        { id: 4, name: "JVB供应商" }
      ],
      // 日本
      JPpageTitle: [],
      // typelist: ["成品", "配件", "原料"],
      newsTypeList: [],
      typelist: [
        { name: '产品', queryType: '1' },
        { name: '配件', queryType: '2' },
        { name: '原料', queryType: '3' },
        { name: '市场资源', queryType: '0' },
      ],
      ActiveIndex: 0,
      ActiveIndex1: 0,
      vendorBrand: "", //  banner图
      query: {
        type: "",
        pageIndex: 1,
        pageSize: 10
      },
      list: [],
      isTypeFlag: false,
      supplierTypeIndex: 0,
      loading: false,
      finished: false,
      galleryTop: null,
      initialSlide: 0,
      defaultLogo: require("@/assets/images/defaultLogo.png"),
      roleList: [],
    };
  },
  async created() {
    console.log(this.$store.getters.roleList);
    console.log(JSON.parse(this.$store.getters.roleList));
    console.log('brand supplier');
    this.roleList = JSON.parse(this.$store.getters.roleList)
    if(this.roleList.length > 0){
        this.JPpageTitle.push({ id: 2, name: "最新日本供应链资讯", })
        this.JPpageTitle.push({ id: 1, name: "厂商资源" })
      
        this.newsTypeList.push({ name: '全部', queryType: '' })
        this.newsTypeList.push({ name: '合作供应商', queryType: '1' })
        this.newsTypeList.push({ name: '市场资讯', queryType: '2' })
    }else{
        this.JPpageTitle.push({ id: 2, name: "最新日本供应链资讯", })
        
        this.newsTypeList.push({ name: '市场资讯', queryType: '2' })
    }
    try {
      this.$store.commit('SHOW_LOADING')
      await this.fetchVendorBrandData()
      this.isType()
      this.getSwiperInit()
    } catch (error) {
      console.error(error)
    } finally {
      this.$store.commit('SHOW_LOADING', false)
    }
  },
  computed: {
    infoQuery() {
      return {
        pageIndex: this.query.pageIndex,
        pageSize: this.query.pageSize,
        cmsInfoType: this.query.type ? '' + this.query.type : ''
      }
    }
  },
  methods: {
    format(date) {
      if (!date) {
        return ''
      }
      return formatDate( date, 'Y年M月D日' )
    },
    // 加载资讯
    onInfoLoad() {
      searchInfoPage(this.infoQuery).then(res => {
        this.loading = false
        if(!res || !res.records || res.records.length == 0) {
          this.finished = true
          return
        }
        this.list = this.list.concat(res.records)
        this.query.pageIndex++
        // 加载状态结束
        
      }).catch(error => {
        this.loading = false
        this.finished = true
      })
    },
    onLoad() {
      if (this.currentTitleIndex === 0 && this.$route.query.type == 'JP') {
        this.initialSlide = 1
        this.onInfoLoad()
        return;
      }
      searchPage(this.query).then(res => {
        if(res.list.length == 0) {
          this.finished = true
        }
        this.list = this.list.concat(res.list)
        this.query.pageIndex++
        // 加载状态结束
        this.loading = false
      }).catch(error => {
        this.finished = true
      })
    },
    isType() {
      if (this.$route.query.type == "brand") {
        this.query.type = 1 // 成品
        this.query.goodsServiceType = [1] //商品服务类型：1: 'NB'  2: 'ODM'  3: 'PB'  4: JVB 5:OEM
        this.title = this.pageTitle
        this.getSearchPage()
      } else if (this.$route.query.type == "JP") {
        document.title = '日本供应链资源专区'
        // if (this.$route.query.sourceType && this.$route.query.sourceType == 'market') {
        //   this.query.type = 0 //市场
        // } else {
        //   this.query.type = 1 //厂商
        // }
        this.query.country = '日本'
        this.title = this.JPpageTitle

        if (this.$route.query.sourceType === 'market') {
          if(this.roleList.length <= 0){
            this.query.type = '2'
          }
          this.getInfoPage()
        }else {
          if(this.roleList.length > 0){
            this.query.type = '1'
            this.getSearchPage()
          }else{
            this.query.type = '2'
            this.getInfoPage()
          }
        }
      }
    },
    getSearchPage() {
      searchPage(this.query).then(res => {
        this.list = res.list
        this.query.pageIndex++
        this.finished = false
      }).catch(error => {
        this.finished = false
      })
    },
    // 获取资讯的列表 日本
    getInfoPage() {
      searchInfoPage(this.infoQuery).then(res => {
        this.list = res.records
        this.query.pageIndex++
        this.finished = false
      }).catch(error => {
        this.finished = false
      })

    },
    fetchVendorBrandData() {
      return cmsSelectPage({
        pageIndex: 1,
        pageSize: 1,
        infoCategoryId: this.$route.query.type == "JP" ? cmsCategoryId.JPBrand : cmsCategoryId.vendorBrand,
        status: "1",
        orderStr: "orderLevel desc, pubTimestamp desc, createTimestamp desc"
      }).then(res => {
        this.vendorBrand = res.records
      })
    },

    // 初始化滑动-父盒子
    getSwiperInit() {
      setTimeout(() => {
        let galleryThumbs = new Swiper('.gallery-thumbs', {
          initialSlide: this.initialSlide,
          slidesPerView: 3,
          autoHeight: true,
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          onSlideChangeEnd: function (galleryThumbs) {
            galleryThumbs.update(); //swiper更新
          }
        });
        this.galleryTop = new Swiper('.gallery-top', {
          initialSlide: this.initialSlide,
          autoHeight: true,
          allowTouchMove: false, //阻止滑动
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          thumbs: {
            swiper: galleryThumbs
          },
          onSlideChangeEnd: function (a) {
            a.update(); //swiper更新
          }
        })
        if (this.$route.query.type === 'JP' && this.$route.query.sourceType !== 'market') {
          this.currentTitleIndex = this.roleList.length > 0 ? 1 : 0;
          this.galleryTop.slideTo(1)
        }
      },100)
    },
    // 总标题切换
    getSupplier(item, index) {
      this.currentTitleIndex = index;
      this.clearQuery()
      if(this.$route.query.type == "JP") {
        if (item.name === "最新日本供应链资讯" ) {
          this.getInfoPage()
          return ;
        }
        this.query.country = '日本'
        this.getSearchPage()
        return
      }
      this.query.goodsServiceType = [item.id]; //商品服务类型：1: 'NB'  2: 'ODM'  3: 'PB'  4: JVB 5: OEM
      this.getSearchPage();
    },
    getActive(item, index) {
      this.list.length = 0
      this.query.pageIndex = 1
      this.query.country = '日本'
      this.ActiveIndex = index
      this.query.type = item.queryType //商品服务类型：1: 'NB'  2: 'ODM'  3: 'PB'  4: JVB 5: OEM
      this.getSearchPage()
    },
    // 资讯类型切换搜索
    getActive1(item, index) {
      this.list.length = 0
      this.query.pageIndex = 1
      this.query.country = '日本'
      this.ActiveIndex1 = index
      this.query.type = item.queryType 
      this.getInfoPage()
    },
    clearQuery(){
      this.list = []
      this.query.pageIndex = 1
      if (this.$route.query.type == "JP") {
        if (this.currentTitleIndex === 0) {
           this.query.type = this.newsTypeList[this.ActiveIndex1].queryType
        } else {
          this.query.type = this.typelist[this.ActiveIndex].queryType
        }

      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  background: white;
  height: 100vh;
  overflow-x: hidden;
}
.supplier {
  position: relative;
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

// 总盒子
.heightAuto{
  height: 1px !important;
}
.galleryDiv {
  height: 1px;
  overflow: hidden;
  margin-bottom: 3rem;
  ul {
    margin: 0 auto;
    background: white;
    background: rgba(255, 255, 255, 1);
    // box-shadow: 0px 2px 30px 0px rgba(58, 120, 239, 0.08);
    border-top: 10px solid #f9f9f9;
    border-bottom: 10px solid #f9f9f9;

    padding-top: 1rem;
    li {
      width: 92%;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
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
  margin-top: 15px;
  //   margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  span {
    // display: inline-block;
    flex: 1;
    letter-spacing: 2px;
    font-size: 15px;
    padding: 4px 3px 10px 4px;
    color: #afafaf;
    font-weight: 400;
    text-align: center;
  }
}
.Cooperation {
  //   background: #f9f9f9;
  .Cooperation_son {
    // background: white;
    .Cooperation_son_one {
      margin-top: 28px;
      margin-bottom: 28px;
      img {
        width: 64px;
        height: 64px;
        object-fit: contain;
      }
    }
    p {
      font-size: 15px;
      margin-top: 14px;
      color: #262626;
    }
  }
}

.gallery-thumbs {
  width: 100%;
  background: white;
  z-index: 999;
}

.SubpplierBtn {
  margin: 0 auto;
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  span {
    color: #707070;
    background: rgba(246, 246, 246, 1);
    display: inline-block;
    width: 80px;
    height: 30px;
    font-size: 13px;
    line-height: 30px;
    text-align: center;
    margin-right: 16px;
  }
  span:last-child {
    margin: 0;
  }
  .SubpplierBtnActive {
    color: white;
    background: rgba(87, 180, 180, 1);
  }
}
/deep/ .van-grid-item{
  overflow: hidden;
  border:1px solid #fcfcfd;
}
</style>
