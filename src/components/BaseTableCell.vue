<template>
  <div class="tableCell">
    <ul>
      <li v-for="item in data" :key="item.name" :class="{'borderBottom':item.border}">
        <!-- 普通文本 默认-->
        <div
          v-if="!item.hasOwnProperty('type') || item.type == 'text'"
          class="type_text wpct100 row flex-start van-hairline--bottom"
        >
          <span>{{ item.label }}</span>
          <span>{{ item.value || '-' }}</span>
        </div>
        <!-- 多行文字 -->
        <div v-if="item.type == 'textarea'" class="type_textarea wpct100 van-hairline--bottom">
          <span>{{ item.label }}</span>
          <p>{{ item.value || '-' }}</p>
        </div>
        <!-- 图片  img-->
        <div v-if="item.type == 'img'" class="type_img van-hairline--bottom">
          <p>{{ item.label }}</p>
          <div
            v-for="img in item.value"
            :key="img.label"
            class="type_img_row pt20"
            @click="onClickImg(item.value)"
          >
            <div>
              <img :src="img.url || require('@/assets/images/logo.png')" />
            </div>
            <div>
              <span class="ellipsis2">{{ img.label }}</span>
              <van-icon name="arrow" color="#CCCCCC" />
            </div>
          </div>
        </div>
        <!-- 横排图片  row_img -->
        <div v-if="item.type == 'row_img'" class="type_row_img van-hairline--bottom">
          <p>{{ item.label }}</p>
          <div class="type_row_img_son pt20">
            <div v-for="img in item.value" :key="img.label" @click="onClickImg(item.value)">
              <img :src="img.url" alt />
            </div>
          </div>
        </div>
        <!-- 文本 -->
        <div v-if="item.type == 'file'" class="type_row_file wpct100 row flex-start van-hairline--bottom">
          <p>{{ item.label }}</p>
          <div>
            <van-button
              plain
              type="info"
              size="small"
              v-for="file in item.value"
              :url="file.url"
              :key="file.label"
              class="mr10 mb10"
            >{{ file.label }}</van-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  name: "BaseTableCell",
  props: {
    data: {
      // 传入的数据数组
      type: Array,
      default: () => {}
    },
    type: {
      type: String,
      default: "text"
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onClickImg(item) {
      let arr = item.filter(ele => ele.url).map(value => value.url)
      if (arr.length) {
        ImagePreview({images:arr,className:'imagePreviewEle'});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tableCell {
  overflow: hidden;
  ul {
    margin: 0 auto;
    background: white;
    background: rgba(255, 255, 255, 1);
    // box-shadow: 0px 2px 30px 0px rgba(58, 120, 239, 0.08);
    border-top: 10px solid #f9f9f9;
    border-bottom: 10px solid #f9f9f9;
    // padding-top: 16px;
    li {
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      // padding: 12.8px 4%;
      padding: 0 15px;
      &>div{
        padding: 20px 0;
      }
      //普通文本
      .type_text {
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
          width: 65%;
          margin-left: 5%;
        }
      }

      //type_textarea
      .type_textarea {
        span {
          display: inline-block;
          font-size: 15px;
          word-break: break-all;
          overflow: hidden;
          color: #959ca7;
        }
        p {
          margin-top: 18px;
          font-size: 15px;
        }
      }
      // 图片类型
      .type_img {
        width: 100%;
        p {
          color: #959ca7;
          font-size: 15px;
        }
        .type_img_row {
          width: 100%;
          // margin-top: 23px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          div:nth-child(1) {
            width: 60px;
            height: 60px;
            margin-right: 12px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          div:nth-child(2) {
            flex: 1;
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
          span {
            color: #262626;
            font-size: 16px;
          }
        }
      }

      // 横排图片
      .type_row_img {
        width: 100%;
        p {
          color: #959ca7;
          font-size: 15px;
        }
        .type_row_img_son {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          div {
            margin-bottom: 10px;
            width: 60px;
            height: 60px;
            margin-right: 12px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
      .type_row_file {
        width: 100%;
        p {
          color: #959ca7;
          font-size: 15px;
          width: 30%;
        }
        div {
          width: 65%;
          margin-left: 5%;
        }
      }
    }
  }
}
.borderBottom {
  border-bottom: 10px solid #f9f9f9;
}
</style>
