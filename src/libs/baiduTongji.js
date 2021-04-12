import config from '@/config';
const _hmt = _hmt || [];
window._hmt = _hmt; // 修改为window 全局变量
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?"+config.baiduSiteId;
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

window._hmt.push(['_requirePlugin', 'UrlChangeTracker', {
    shouldTrackUrlChange: function (newPath, oldPath) {
      return newPath && oldPath;
    }}
  ]);

