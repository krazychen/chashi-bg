export function openWechatQRCode(redirectURL) {
  const appid = 'wx49bdbb228ac47a68'
  // const URI = encodeURIComponent('http://www.yanjiusen.com/#/wxlogin')
  const redirectURI = encodeURIComponent(redirectURL)
  const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirectURI + '&response_type=code&scope=snsapi_login#wechat_redirect'
  window.open(url, '_parent')
}
