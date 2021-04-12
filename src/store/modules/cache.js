
export default {
  state: {
    cachePages: [],
  },
  mutations: {
    PUT_CACHE_PAGE(state, page) {
      if (!state.cachePages.includes(page)) {
        state.cachePages.push(page)
      }
    },
    REMOVE_CACHE_PAGE(state, page) {
      if (state.cachePages.indexOf(page) > -1) {
        state.cachePages.splice(state.cachePages.indexOf(page), 1)
      }
    }
  },
  actions: {}
}