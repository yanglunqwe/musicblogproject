// pages/mvplay/mvplay.js
let indexsrc=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvid:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      mvid:options.mvid
    })
    this.mvplay()
  },
  mvplay(){
    wx.request({
      url: `https://apis.imooc.com/mv/detail?mvid=${this.data.mvid}&icode=8A6D3304F2BA74C2`,
      success:((res)=>{
        console.log(res)
        console.log(res.data.data.brs)
        indexsrc=res.data.data.brs
        console.log(Object.values(indexsrc)[0])
        this.setData({
          src:Object.values(indexsrc)[0]
        })
      })
    })
    //let src=indexsrc.split(',')
    //console.log(src)
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