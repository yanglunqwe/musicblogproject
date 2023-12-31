//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
         env: 'test-4gl7utre881a508f',
        traceUser: true,
      })
    }
    this.getOpenid()
    this.globalData = {
      playingMusicId:-1,
      openid:-1 //用户全局唯一标识openid,不需要授权
    }
  },
  setPlayMusicId(musicId){
    this.globalData.playingMusicId=musicId
  },
  getPlayMusicId(){
    return this.globalData.playingMusicId
  },
  getOpenid(){
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      //console.log(res)
      const openid = res.result.openid
      console.log(typeof(openid))
      console.log(openid)
      this.globalData.openid = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  }
})
