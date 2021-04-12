<template>
  <div id="page">
    <ul class="CustomerCaseList">
        <li v-if="info.titleImage">
            <div class="salesInformation">
                <div>
                <img :src="info.titleImage" alt />
                </div>
                <div>
                    <p>{{ (ecologyUser && ecologyUser.lastname) ? ecologyUser.lastname : info.title}}</p>
                    <p>{{ (ecologyUser && ecologyUser.departmentname) ? ecologyUser.departmentname : info.subhead}}</p>
                    <!-- <p>私信</p> -->
                </div>
            </div>
            <p class="salesBottomP">关联客户: {{info.keyword}}</p>
        </li>
    </ul>
    <div class="userfInfo" v-html="info.content"></div>
  </div>
</template>

<script>
import { getEcologyUserByWorkCode } from '@/api/index'
import { getOne } from '@/api/cmsInfo'
export default {
  name: 'Purchaser',
  components: {},
  data() {
    return {
        info:{},
        ecologyUser: {}
    }
  },
  computed: {},
  async created() {
    this.$toast.loading({duration: 0,message: "加载中...",forbidClick: true});
    await this.fetchCmsInfoData()
    if(this.info.source) this.fetchEcologyUser()
  },
  methods: {
    fetchCmsInfoData() {
      return getOne(this.$route.query.id).then(res => {
        this.info = res;
        this.$toast.clear();
      })
    },
    fetchEcologyUser() {
      return getEcologyUserByWorkCode(this.info.source).then(ecologyUser => {
        this.ecologyUser = ecologyUser
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#page {
  height: 100vh;
  background: white;
  overflow-y: scroll;
}
.CustomerCaseList {
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  background: #fefeff;
  transform: translateZ(0);
  margin-top: 5%;
  li {
    background: white;
    // padding:5% 3% 5% 3%;
    width:92%;
    margin:0 auto;
    margin-bottom: 12.8px;
    overflow: hidden;
    // box-shadow:0px 2px 29px 0px rgba(58,120,239,0.08);
    border-radius:8px;
    .salesBottomP{
        font-size:14px;
        color:rgba(149,156,167,1);
        line-height:18px;
        margin-top: 1.64px;
    }
  }
  .salesInformation{
    display: flex;
    align-content: center;
    align-items: center;
    text-align: left;
    overflow: hidden;
    position: relative;
    div:nth-child(1) {
      // width: 30%;
      width: 80px;
      height: 80px;
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
        transform: translate(-50%, -50%);
        object-fit: cover
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
      p:nth-child(3){
        position: absolute;
        right: 5%;
        top: 50%;
        transform: translate(0px,-50%);
        width:90px;
        height:30px;
        background:#57B4B4;
        border-radius:17px;
        line-height: 30px;
        text-align: center;
        color: white;
        font-size: 14px;
      }
    }
    }   
}
.userfInfo{
    overflow: hidden;
    width: 90%;
    margin: 0 auto;
    font-size:15px;
    font-weight:400;
    color:rgba(57,60,65,1);
    line-height:30px;
    img{
      max-width:100%;
      height: 100%;
    }
}
</style>
