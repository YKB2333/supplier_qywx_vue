<template>
  <div id="mine" class="min-h-full">
    <div class="header-box">
      <div class="user-info clientBorderBottom">
        <div class="avatar-wrapper">
          <img :src="wxCpUser.avatar || require('@/assets/images/logo.png')" />
        </div>
        <div class="content">
          <p class="username">{{wxCpUser.name}}</p>
          <p class="depart">{{wxDept.name}} · {{wxCpUser.position}}</p>
        </div>
      </div>

      <div class="grid-wrapper ">
        <van-grid :border="false" :column-num="3">
          <van-grid-item @click="$router.push('/messageIndex')">
            <p :class="['num',{'mineRnd':(msgCount + purchaseCount + clientMsgCount)}]">
              {{(msgCount + purchaseCount + clientMsgCount) > 99 ? '99+' : (msgCount + purchaseCount + clientMsgCount)}}
            </p>
            <p class="text">消息</p>
          </van-grid-item>
          <van-grid-item :to="{path: '/collectList'}">
            <p class="num">{{ collectCount }}</p>
            <p class="text">收藏</p>
          </van-grid-item>
          <van-grid-item>
            <p class="num">{{ likeCount }}</p>
            <p class="text">点赞</p>
          </van-grid-item>
        </van-grid>
      </div>
    </div>

    <div class="cell-wrapper">
    
      <!-- <van-cell
        v-for="(item, index) in processList"
        :key="index"
        :title="item.title"
        is-link
        :icon="item.titleImage"
        :to="{ path: '/processDetail', query: { infoId: item.id } }"
      /> -->
      <van-cell
        title="成长手册"
        is-link
        :icon="require('@/assets/images/mine/icon_up.png')"
        :to="{ path: '/growthBook' }"
      />
      <van-cell
        title="商品中心"
        is-link
        :icon="require('@/assets/images/mine/icon_goods.png')"
        @click="toOtherApp('goods')"
      />
      <van-cell
        title="客户中心"
        is-link
        :icon="require('@/assets/images/mine/icon_supplier.png')"
        @click="toOtherApp('customer')"
      />
      <van-cell
        title="历史版本"
        is-link
        :icon="require('@/assets/images/mine/mine_icon_ls@2x.png')"
        :to="{ path: '/version' }"
      />
    </div>
  </div>
</template>

<script>
import { currentUser, deptById } from "@/api/user";
import { noticeCount, purchaseNoticeCount, wxMiniAppNoticeCount } from "@/api/message";
import { favoriteCount, likeCount } from "@/api/common";
import { selectPage as getInfoList } from "@/api/cmsInfo";
import { apiAgent, clientApiAgent } from '@/config'

export default {
  name: "Mine",
  components: {},
  data() {
    return {
      collectCount: 0, // 收藏数
      likeCount: 0, // 点赞数
      wxCpUser: {}, // 用户信息
      wxDept: {}, // 用户部门信息
      msgCount: 0, // 未读消息
      purchaseCount: 0, // 未读采购需求
      clientMsgCount: 0,
      processList: [] // 流程栏目
    };
  },
  computed: {},
  async created() {
    this.fetchProcessList();
    await this.fetchUserData();
    if (this.wxCpUser.departIds && this.wxCpUser.departIds.length > 0)
      this.fetchDeptData();
    favoriteCount({
      pageIndex:1,
      pageSize:100,
      sysTag:apiAgent,
    }).then(res => {
      this.collectCount = res;
    });
    likeCount().then(res => {
      this.likeCount = res;
    });
    this.fetchMsgCount();
    this.fetchPurchaseMsgCount();
    this.fetchClientMsgCount();
  },
  methods: {
    fetchMsgCount() {
      let p1 = noticeCount({
        readStatus:0,
        sysTag: apiAgent
      }).then((result) => {
        this.msgCount = result;
      }).catch((error) => {
      })
    },
    fetchPurchaseMsgCount() {
      let p1 = purchaseNoticeCount({
        readStatus:0,
        sysTag: apiAgent
      }).then((result) => {
        this.purchaseCount = result;
      }).catch((error) => {
      })
    },
    fetchClientMsgCount() {
      let p1 = wxMiniAppNoticeCount({
        readStatus:0,
        sysTag: clientApiAgent
      }).then((result) => {
        this.clientMsgCount = result;
      }).catch((error) => {
        // 这里只有具有supplier_message_manager角色权限的用户才能成功调用，其他人调用会报500
      })
    },
    fetchUserData() {
      return currentUser().then(res => {
        console.log(res);
        this.wxCpUser = res;
      });
    },
    fetchDeptData() {
      return deptById(this.wxCpUser.departIds[0]).then(res => {
        this.wxDept = res;
        console.log(res);
      });
    },
    // 流程栏目资讯
    fetchProcessList() {
      getInfoList({
        pageIndex: 1,
        pageSize: 100,
        status: "1",
        orderStr: "orderLevel desc, pubTimestamp desc, createTimestamp desc",
        infoCategoryId: this.$config.cmsCategoryId["process"]
      }).then(res => {
        console.log("流程", res);
        this.processList = res.records;
      });
    },
    toOtherApp(app) {
      window.open(`${this.$config.otherAppLogin[app]}`, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.grid-wrapper,
.user-info {
  p {
    margin: 0 !important;
    padding: 0 !important;
  }
}
#mine {
  background: #f9f9f9;
  .header-box {
    background: white;
    border-bottom: 10px solid #f9f9f9;
    // padding: 20px 0;
    .user-info {
      display: flex;
      padding: 28px 16px 28px 16px ;
      .avatar-wrapper {
        width: 60px;
        height: 60px;
        margin-right: 12px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .name {
          color: #262626;
          font-size: 22px;
          font-weight: 600;
        }
        .depart {
          color: #707070;
          font-size: 14px;
        }
      }
    }
    .grid-wrapper {
      .num {
        font-size: 22px;
        color: #262626;
        font-weight: 600;
        &.color {
          color: #ed7874;
        }
      }
      .text {
        font-size: 13px;
        color: #262626;
      }
    }
  }
  .cell-wrapper {
    .van-cell {
      padding: 18px 16px;
    }
    .van-cell__title {
      color: #262626;
      font-size: 16px;
    }
    .van-cell__left-icon {
      font-size: 22px;
      margin-right: 16px;
    }
    .van-cell__right-icon {
      color: #afafaf;
    }
    .van-cell:not(:last-child)::after {
      left: 0;
    }
  }
}
.userinfo {
  display: flex;
  align-content: center;
  align-items: center;
  text-align: left;
  overflow: hidden;
  position: relative;
  width: 90%;
  margin: 0 auto;
  margin-top: 32px;
  margin-bottom: 1.48px;
  div:nth-child(1) {
    width: 64px;
    height: 64px;
    border: 1px solid rgba(244, 244, 244, 1);
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  }
  div:nth-child(2) {
    // width: 30%;
    margin-left: 3.7%;
    p {
      margin: 0;
      padding: 0;
    }
    p:nth-child(1) {
      color: #393c41;
      font-size: 18px;
      font-weight: 600;
    }
    p:nth-child(2) {
      margin-top: 4%;
      color: #aeb3ba;
      font-size: 14px;
    }
    p:nth-child(3) {
      position: absolute;
      right: 0%;
      top: 50%;
      transform: translate(0px, -50%);
    }
  }
}

.clientBorderBottom {
  // border-bottom: 15px solid #f3f4f9;
  border-bottom: 10px solid #f9f9f9;

}

/deep/ .van-grid-item__content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    padding: 25px 8px;
    background-color: #fff;
}
.mineRnd{
  color: #FF3750 !important;
}
/deep/ .van-icon{
  display: flex;
}
</style>
