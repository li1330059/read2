import wx from 'weixin-js-sdk'
import $store from '../store/index.js'
import sha1 from 'sha1'
function getPageUrl() {
  var url = window.location.href;
  var idx = url.indexOf("#");
  if (idx != -1) { url = url.substr(0, idx); }
  return url;
}

function getSignature(jsapi_ticket, noncestr, timestamp, url) {
  var string1 = '';
  string1 += 'jsapi_ticket=' + jsapi_ticket;
  string1 += '&noncestr=' + noncestr;
  string1 += '&timestamp=' + timestamp;
  string1 += '&url=' + url;
  return sha1(string1);
}
export async function wechatSharefund() {
//  console.log('wechatSharefund ++++++++++++++++++++++++000');
  // 注册
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let num = ''
  for (var i = 0; i < 16; i++) {
    let id = parseInt(Math.random() * 62);
    num += chars[id];
  }
  let time = Date.parse(new Date()) / 1000
  let url = getPageUrl()
  let sign = getSignature($store.state.jsApiTicket, num, time, url)
  let location = window.location.href
  location = location.substring(0, location.lastIndexOf('/'))
  location += '/index?pid=' + localStorage.getItem("pid") ? localStorage.getItem("pid") : ""
  if ($store.state.articleId) location = window.location.href
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: $store.state.wxAppId, // 必填，公众号的唯一标识
    timestamp: time, // 必填，生成签名的时间戳
    nonceStr: num, // 必填，生成签名的随机串
    signature: sign,
    jsApiList: [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'startRecord',
      'stopRecord',
      'playVoice',
      'onVoiceRecordEnd',
      'uploadVoice',
      'onVoicePlayEnd',
      'downloadVoice',
      'updateAppMessageShareData',
      'updateTimelineShareData'
    ] // 必填，需要使用的JS接口列表
  })
  // 是否成功
  wx.ready(function () {
//    console.log('设置微信分析', $store.state.articleTitle? $store.state.articleTitle: '英语阅读公众号')
    wx.updateAppMessageShareData({
      title: '英语阅读', // 分享标题
      desc: $store.state.articleTitle ? $store.state.articleTitle : '英语阅读公众号', // 分享描述
      link: location, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: 'https://z3.ax1x.com/2021/08/31/hU3sd1.png', // 分享图标
      success: function () {
//        console.log('微信分析设置成功', $store.state.articleTitle? $store.state.articleTitle: '英语阅读公众号')
      }
    })


  });
  // 是否支持指定JS接口
  wx.checkJsApi({
    jsApiList: ['startRecord', 'updateAppMessageShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    success: function (res) {
      console.log([res, '114'])
      // store.commit('jsApiList', res)
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    }
  })
  wx.error(function (err) {
    console.log('错误', err)
    // Message.error(JSON.stringify(err)+'1')
  })
}