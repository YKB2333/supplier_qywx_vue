import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import getters from './getters'
import user from './modules/user'
import app from './modules/app'
import cache from './modules/cache'

// 导出 store 对象
export default new Vuex.Store({
  getters,
  modules: {
    user,
    app,
    cache
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
});
