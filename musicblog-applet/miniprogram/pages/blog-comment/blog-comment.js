// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentList:[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.blogId)
    this.setData({
      blogId:options.blogId
    })
    this.getBlogDetail()
  },
  //获取博客详情
  getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then((res)=>{
      console.log(res)
      //对评论信息的时间进行格式化操作
      let commentList=res.result.commentList.data
      for(let i=0,len=commentList.length;i<len;i++){
        commentList[i].createTime=formatTime(new Date(commentList[i].createTime))
      }
      this.setData({
        blog:res.result.detail[0],
        commentList:commentList
      })
      wx.hideLoading()
      console.log(res) //获取博客信息和评论信息
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
     let blogObj = this.data.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: ''
    }
  }
})