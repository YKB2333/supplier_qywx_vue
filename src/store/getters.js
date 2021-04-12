const getters = {
  token: state => state.user.token,
  jumpUrl: state => state.user.jumpUrl,
  roleList: state => state.user.roleList,
  cachePages: state => state.cache.cachePages,
  loading: state => state.app.loading,
  searchHistory: state => {
    // 数组去重
    return Array.from(new Set(state.app.searchHistory)).slice(0, 10)
  },
}
export default getters
