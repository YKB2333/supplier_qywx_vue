import { projectKey } from '@/config'
export default {
  state: {
    loading: {
      show: false,
      text: ''
    },
    searchHistory: JSON.parse(localStorage.getItem(`${projectKey}searchHistory`)) || []
  },
  mutations: {
    SHOW_LOADING(state, param) {
      if (param === undefined) {
        state.loading.show = true;
      } else {
        if (typeof param === 'boolean') {
          state.loading.show = param;
          state.loading.text = '';
        } else if (typeof param === 'string') {
          state.loading.show = true;
          let loadingText = param;
          state.loading.text = loadingText;
        }
      }
    },
    SET_SEARCH_HISTORY(state, val) {
      if (Array.isArray(val)) { // 清空
        state.searchHistory = []
        localStorage.removeItem(`${projectKey}searchHistory`)
      } else { // 添加
        state.searchHistory.unshift(val)
        localStorage.setItem(`${projectKey}searchHistory`, JSON.stringify(state.searchHistory))
      }
    }
  },
  actions: {}
}