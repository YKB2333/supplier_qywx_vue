import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import libs from './libs'
import * as filters from './filters'
import "swiper/css/swiper.min.css"
import '@/mixins/wx-share'

Vue.use(libs, { router, store })
Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$maxNumber = 2147483647

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
