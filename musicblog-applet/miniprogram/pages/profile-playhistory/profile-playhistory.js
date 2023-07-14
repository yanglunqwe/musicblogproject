// pages/profile-playhistory/profile-playhistory.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[], //历史播放歌曲列表
    smuiclist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //获取本地存储中的播放历史
     console.log("123")
     const playHistory=wx.getStorageSync(app.globalData.openid)
     console.log(playHistory)
     console.log(playHistory.length)
     let songs=[]
     let picUrl=[]
     let singers=[]
     for(let i=0;i<playHistory.length;i++){
       songs.push(playHistory[i][0][0])
       picUrl.push(playHistory[i][1][0])
       singers.push(playHistory[i][2])
     }
     console.log(songs)
     console.log(picUrl)
     console.log(singers)
     let all=[songs,picUrl,singers]
     console.log(all)
     let musicHistory=[]
     let smuiscHistory=[]
     /*
     for(let i=0;i<playHistory.length;i++){
      if(Object.keys(playHistory[i][0][0])[1]=="id"){
        console.log("1111111111")
        musicHistory.push(playHistory[i])
      }
      else{
        smuiscHistory.push(playHistory[i])
      }
     }
     console.log(musicHistory)
     const history=[musicHistory,smuiscHistory]
    // console.log(playHistory)
     console.log(history)*/
     if(playHistory.length==0){
       wx.showModal({
         title:'播放历史为空',
         content:''
       })
     }
     else{
       //将本地存储的musiclist替换成最近播放的歌曲列表信息
       wx.setStorage({
         data: all,
         key: 'musiclist',
       })
       this.setData({
         musiclist:all
       })
       console.log(this.data.musiclist)
     }
     //console.log(this.data.musiclist[0])
     //console.log(this.data.musiclist[1])
     //console.log(playHistory)
   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})