// pages/musiclist/musiclist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then((res) => {
      console.log(res)
      const pl = res.result.playlist
      let arr = []
      let singers = []
      const Ids = pl.trackIds.slice(0,100)
      const trackIds = []
      for (let i = 0; i < Ids.length; i++) {
        trackIds.push(Ids[i].id)
      }
      console.log(trackIds)
      const musiclistIds = JSON.stringify(trackIds).replace(/[\[\]]/g, '')
      //console.log(musiclistIds)
      //let details = []
      //console.log(songsId[i])
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musiclistIds: musiclistIds,
          $url: 'detail'
        }
      }).then((res) => {
        //console.log(res.result.songs)
        const songs = res.result.songs
        console.log(songs)
        const musiclist = [songs, arr, singers]
        for (let i = 0; i < songs.length; i++) {
          arr.push(songs[i].al.picUrl)
          singers.push(songs[i].ar[0].name)
        }
        console.log(musiclist)
        this.setData({
          musiclist: musiclist,
          listInfo: {
            coverImgUrl: pl.coverImgUrl,
            name: pl.name,
          }
        })
        this._setMusiclist()
        wx.hideLoading()
      })
    })
  },
  //存储歌曲列表数据
  _setMusiclist: function () {
    wx.setStorageSync('musiclist', this.data.musiclist)
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