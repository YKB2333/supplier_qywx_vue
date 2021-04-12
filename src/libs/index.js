import vant from './vant'
import 'vant/lib/index.css'
import './http'
import config from '../config'
import VConsole from 'vconsole' // 控制台按钮
import moment from 'moment'
import lodash from 'lodash'
import utils from '@/utils'
import VideoPlayer from 'vue-video-player'
import '@/assets/icons' // svg图标
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import './baiduTongji'

let Plugins = {}
Plugins.install = (Vue, { router, store }) => {
  Vue.prototype.$config = config
  Vue.prototype.$moment = moment
  Vue.prototype.$lodash = lodash
  Vue.prototype.$utils = utils
  Vue.use(VideoPlayer)
  Vue.use(vant)
  if (process.env.NODE_ENV === 'production' && config.vconsole) {
    new VConsole()
  }
}

export default Plugins