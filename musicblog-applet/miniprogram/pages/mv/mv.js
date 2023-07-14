// pages/mv/mv.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvlist:[],
    //mvid:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmvlist()
  },
  getmvlist(){
    wx.request({
      url: 'https://music.163.com/api/mv/exclusive/rcmd?limit=15',
      success:((res)=>{
        console.log(res)
        console.log(res.data.data)
        this.setData({
          mvlist:res.data.data,
          //mvid:res.data.data.id
        })
      })
    })
  },
  enterplay(event){
    console.log(event.currentTarget.dataset.mvid)
    wx.navigateTo({
      url: `../../pages/mvplay/mvplay?mvid=${event.currentTarget.dataset.mvid}`,
    })
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