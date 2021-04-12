<template>
  <div class="row plr14 ptb10 van-hairline--top x-scroll" style="z-index: 101">
    <van-button class="custom-radio" round :type="activeName === 'finishedProducts' ? 'primary' : 'default'" @click="onClick('finishedProducts')">
      <template v-if="!isDrowdown">成品{{ count.finishedProducts }}</template>
      <van-dropdown-menu v-else active-color="#57B4B4" :z-index="100">
        <van-dropdown-item 
          get-container="body"
          v-model="optionValue" 
          :options="options" 
          :disabled="isDisabledDrowdown" 
          @change="onChange"
          :title="drowdownTitle"
        >
        </van-dropdown-item>
      </van-dropdown-menu>
    </van-button>
    <van-button class="custom-radio" round :type="activeName === 'accessory' ? 'primary' : 'default'" @click="onClick('accessory')">
      配件{{ count.accessory }}
    </van-button>
    <van-button class="custom-radio" round :type="activeName === 'materials' ? 'primary' : 'default'" @click="onClick('materials')">
      原料{{ count.materials }}
    </van-button>
    <van-button class="custom-radio" round :type="activeName === 'other' ? 'primary' : 'default'" @click="onClick('other')">
      其他{{ count.other }}
    </van-button>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示下拉
    isDrowdown: {
      type: Boolean,
      default: true
    },
    count: {
      type: Object,
      default: () => {
        return {
          finishedProducts: 0,
          accessory: 0,
          materials: 0,
          other: 0,
          brand: 0,
          odm: 0,
          oem: 0
        }
      }
    },
    routerType: String
  },
  data() {
    return {
      activeName: 'finishedProducts',
      optionValue: '',
      options: [],
      typeMap: {
        'finishedProducts': '1',
        'accessory': '2',
        'materials': '3',
        'other': '0',
      }
    }
  },
  computed: {
    // 是否禁用下拉菜单
    isDisabledDrowdown() {
      // 配件、原料、其他 状态下禁用下拉菜单，防止点击回到成品时便立刻显示下来菜单
      if (['accessory', 'materials', 'other'].includes(this.activeName)) {
        return true
      }
      return false
    },
    drowdownTitle() {
      let text = ''
      if (this.optionValue === '') {
        text = `成品${this.count.finishedProducts}` 
      } else if (this.optionValue === '1') {
        text = `品牌${this.count.brand}` 
      } else if (this.optionValue === '2') {
        text = `ODM${this.count.odm}` 
      } else if (this.optionValue === '3') {
        text = `OEM${this.count.oem}` 
      } 
      return text
    }
  },
  methods: {
    onClick(val) {
      if (this.activeName === 'finishedProducts' && val === 'finishedProducts') return
      // console.log('btn-click')
      this.activeName = val
      // console.log(this.activeName)
      this.$emit('change', {
        type: this.typeMap[this.activeName],
        productType: this.optionValue
      })
    },
    onChange(value) {
      // console.log('下拉', value)
      // this.$emit('change', {
      //   type: '1',
      //   productType: value
      // })
    }
  },
  watch: {
    count: {
      handler: function(data) {
        if (this.isDrowdown) {
          // console.log('watch', data)
          this.options.length = 0
          this.options.push({ text: `成品（${data.finishedProducts}）`, value: '' })
          this.options.push({ text: `品牌供应商（${data.brand}）`, value: '1' })
          this.options.push({ text: `ODM供应商（${data.odm}）`, value: '2' })
          this.options.push({ text: `OEM供应商（${data.oem}）`, value: '3' })
        }
      },
      immediate: true,
      deep: true
    },
    optionValue(value) {
      this.$emit('change', {
        type: '1',
        productType: value
      })
    },
    routerType: {
      immediate: true,
      handler: function (type) {
        console.log('type', type)
        if (['ODM', 'OEM'].includes(type)) {
          let valueMap = { ODM: '2', OEM: '3' }
          this.optionValue = valueMap[type]
            this.$emit('change', {
              type: this.typeMap[this.activeName],
              productType: ''
            })
        } else {
          if (type === 'accessory') {
            this.activeName = type
            this.$emit('change', {
              type: '2',
              productType: ''
            })
          }
        }
      },
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-radio {
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  &:not(:last-child) {
    margin-right: 12px;
  }
}
.van-button--primary {
  background-color: #57B4B4;
  color: #ffffff !important;
  border-color: #57B4B4;
}
.van-button {
  white-space: nowrap;
  color: #707070;
  font-size: 13px;
}

.van-dropdown-menu {
  height: 100%;
  background-color: transparent;
  position: relative;
  right: 4px;
  &::after{
    border: none;
  }
}
/deep/ .van-dropdown-menu__bar {
    background-color: transparent;
    box-shadow: none
}
/deep/ .van-dropdown-menu__title{
  color: #ffffff !important;
  font-size: 13px;
}

/deep/ .van-button--default .van-dropdown-menu__title{
  color: #707070 !important;
}

</style>