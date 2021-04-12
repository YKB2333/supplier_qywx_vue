<template>
  <div id="app" :class="{'tabFooterHeight': showTabbar}">
    <!-- <transition :name="transitionName"> -->
    <keep-alive :include="cachePages">
      <router-view></router-view>
    </keep-alive>
    <!-- </transition> -->
    <!-- 底部导航栏 -->
    <van-tabbar
      v-model="tabActive"
      v-show="showTabbar"
      active-color="#000000"
      :z-index="999"
    >
      <template v-for="(item, index) in tabbar">
        <van-tabbar-item v-if="item.id != 2" :key="index" :to="item.path" replace safe-area-inset-bottom>
          <span>{{ item.name }}</span>
          <img slot="icon" slot-scope="props" :src="props.active ? item.iconActive : item.icon" />
        </van-tabbar-item>
        <van-tabbar-item v-else :key="index" @click="openCustService" safe-area-inset-bottom>
          <span>{{ item.name }}</span>
          <img slot="icon" slot-scope="props" :src="props.active ? item.iconActive : item.icon" />
        </van-tabbar-item>
      </template>
    </van-tabbar>
    <loading :show="loading.show" :text="loading.text"></loading>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Loading  from "@/components/loading";
import { supDetailAuth } from '@/api/supplier'

export default {
  name: "app",
  components: { Loading },
  data() {
    return {
      transitionName: "slide-right",
      tabbar: [
        {
          id: 1,
          name: "首页",
          path: "/home",
          icon: require("@/assets/images/tabbar/home.png"),
          iconActive: require("@/assets/images/tabbar/home-active.png")
        },
        {
          id: 2,
          name: "消息",
          path: "/message",
          icon: require("@/assets/images/tabbar/message.png"),
          iconActive: require("@/assets/images/tabbar/message-active.png")
        },
        {
          id: 3,
          name: "厂商资源",
          path: "/find",
          icon: require("@/assets/images/tabbar/category.png"),
          iconActive: require("@/assets/images/tabbar/category-active.png")
        },
        {
          id: 4,
          name: "我的",
          path: "/mine",
          icon: require("@/assets/images/tabbar/mine.png"),
          iconActive: require("@/assets/images/tabbar/mine-active.png")
        }
      ],
      showTabbar: false
    };
  },
  computed: {
    ...mapGetters(["cachePages", "loading"]),
    tabActive: {
      get() {
        let index = this.tabbar.findIndex((value, index, arr) => {
          return value.path === this.$route.path;
        });
        return index;
      },
      set(val) {
        // console.log(val);
      }
    }
  },
  watch: {
    $route(to, from) {
      let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退
      if (isBack) {
        this.transitionName = "slide-right";
      } else {
        this.transitionName = "slide-left";
      }
      this.$router.isBack = false;

      // 监听路由，判断是否显示底部导航
      let paths = this.tabbar.map(item => item.path);
      // console.log(paths)
      if (paths.includes(to.path)) {
        this.showTabbar = true;
      } else {
        this.showTabbar = false;
      }
    }
  },
  methods: {
    openCustService() {
      // console.info('跳转客服消息')
      let va = this.$config.serviceMan.map(item => item.label).join(';')
      wx.openEnterpriseChat({
        userIds: va, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        groupName: '客服', // 必填，会话名称。单聊时该参数传入空字符串""即可。
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
  },
  async created() {
    if (process.env.NODE_ENV === "development") {
      // 开发环境下使用后门token
      this.$store.commit("SET_TOKEN", this.$config.testToken) ;
    } else {
      if (this.$store.getters.token) {
        // 进行微信签名(url传参为：http://xxx.com/index.html)
        await this.$store.dispatch("weixinConfig", location.href.split("#")[0])
      }
    }
    if (this.$store.getters.token) {
      supDetailAuth().then(res => {
        this.$store.commit("SET_AUTH_ROLE", JSON.stringify(res));
      })
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/index.scss";
@import "@/assets/scss/app.scss";
</style>

<style lang="scss" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  -webkit-transition: all 0.25s ease-out;
  transition: all 0.25s ease-out;
}
.slide-left-enter,
.slide-right-leave-to {
  // -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0);
}
.slide-left-leave-to,
.slide-right-enter {
  // -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}
/deep/ .van-tabbar-item__icon {
    position: relative;
    margin-bottom: 5px;
    transform: scale(1.3);
}

.tabFooterHeight{
  // padding-bottom: 50px;
}
// 长屏安卓
@media screen and(device-width: 375px) and(device-height: 812px) {
  /deep/ .van-tabbar--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    padding-bottom: 16px;
  }
  
}
//x,xs
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /deep/ .van-tabbar--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    padding-bottom: 16px;
  }
 
}
// xr
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  /deep/ .van-tabbar--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    padding-bottom: 16px;
  }
  
}
// xs max
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  /deep/ .van-tabbar--fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    padding-bottom: 16px;
  }
 
}

</style>

