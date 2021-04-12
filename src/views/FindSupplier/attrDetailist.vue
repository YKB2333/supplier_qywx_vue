<template>
  <div class="client">
    <div class="pb10" v-if="type == 'success'">
      <div class="plr14 pt14 pb2">
        <atta-item
          style="box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);"
          v-for="(item, index) in array"
          :key="index"
          :file-name="item.fileName"
          :file-type="item.fileType"
          :size="item.size"
          :attaUrl="item.attaUrl"
        />
      </div>
    </div>
    <div class="pt12" v-if="type == 'recommend'">
      <BaseImageList
        v-for="(item, index) in array"
        :key="index"
        style="margin-bottom:24px;"
        type="right"
        is_link
        :to="{path:'/product/details/index',query:{id:item.id,type:'recommend'}}"
      >
        <template v-slot:title>
          <div style="color:#262626" class="mt10">
            <p class="fs16 fw500 ellipsis">{{ item.name }}</p>
          </div>
          <div style="color:#AFAFAF" class="mt14">
            <span
              class="fs12"
            >上新时间：{{ showRecentTime(item.createDate) }}</span>
          </div>
        </template>
        <template v-slot:img>
          <div class="w100 h100 col center-x" style="background:#F9F9F9">
            <img :src="item.titleImage" class="object-contain" style="width:100%;height:100%" />
          </div>
        </template>
      </BaseImageList>
    </div>
    <div class="pt12" v-else>
      <BaseImageList
        v-for="(item, index) in array"
        :key="index"
        style="margin-bottom:24px;"
        type="right"
        is_link
        :to="{path:'/product/details/index',query:{id:item.id,supId: $route.query.supId, type:'coop'}}"
      >
        <template v-slot:title>
          <div style="color:#262626" class="mt10">
            <p class="fs16 fw500 ellipsis">{{ item.name }}</p>
          </div>
          <div style="color:#AFAFAF" class="mt14">
            <span
              class="fs12"
            >上新时间：{{ showRecentTime(item.createDate) }}</span>
          </div>
        </template>
        <template v-slot:img>
          <div class="w100 h100 col center-x" style="background:#F9F9F9">
            <img :src="item.titleImage" class="object-contain" style="width:100%;height:100%" />
          </div>
        </template>
      </BaseImageList>
    </div>
  </div>
</template>

<script>
import BaseImageList from "@/components/BaseImageList";
import BaseTitle from "@/components/BaseTitle";
import AttaItem from "@/components/AttachmentItem";
import { isEmpty, showRecentTime } from "@/utils";

export default {
  name: "attrDetailist",
  components: {
    BaseImageList,
    BaseTitle,
    AttaItem
  },
  data() {
    return {
      type: "",
      array: [],
      defaultLogo: require("@/assets/images/defaultLogo.png")
    };
  },
  computed: {},
  methods: {
    showRecentTime
  },
  created() {
    console.log(this.$route);
    let type = this.$route.query.type;
    if (type == "coop") {
      document.title = "合作产品-供应商中心";
    } else if (type == "recommend") {
      console.log(document.title);
      document.title = "推荐产品-供应商中心";
    }
  },
  mounted() {
    console.log(this.$route.query.array);
    console.log('attrDetail mounted');
    this.array = JSON.parse(this.$route.query.array);
    console.info(this.$route.query.type);
    this.type = this.$route.query.type;
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
.client {
  overflow-x: hidden;
}
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
  img {
    // width: 68px;
    // height: 68px;
  }
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
