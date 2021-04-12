import { wxSignature } from '../../api/user'
import { weixin, projectKey } from '../../config'

export default {
  state: {
    token: sessionStorage.getItem(`${projectKey}token`) || '',
    jumpUrl: localStorage.getItem(`${projectKey}jumpUrl`) || '',
    roleList: sessionStorage.getItem(`${projectKey}roleList`) || '[]',
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      sessionStorage.setItem(`${projectKey}token`, token);
    },
    SET_JUMPURL(state, jumpUrl) {
      state.jumpUrl = jumpUrl;
      localStorage.setItem(`${projectKey}jumpUrl`, jumpUrl);
    },
    SET_AUTH_ROLE(state, roleList) {
      state.roleList = roleList;
      sessionStorage.setItem(`${projectKey}roleList`, roleList);
    },
  },
  actions: {
    weixinConfig({ commit }, url) {
      return new Promise((resolve, reject) => {
        wxSignature(url).then(data => {
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: weixin.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业微信的corpID
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: weixin.jsApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}