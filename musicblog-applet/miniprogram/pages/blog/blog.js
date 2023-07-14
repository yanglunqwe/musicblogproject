// pages/blog/blog.js
const app = getApp()
let keyword = '' //用户文本输入搜索关键字
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制底部弹出层是否显示
    modalShow: false,
    blogList: [] //博客列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBlogList()
  },
  //用户搜索关键字
  onSearch: function (event) {
    console.log(event.detail.keyword)
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    this.loadBlogList(0)
  },
  //加载博客列表数据
  loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list'
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
      console.log(this.data.blogList)
    })
  },
  //发布功能
  onPublish() {
    /*this.setData({
      modalShow:true
    })*/

    const {
      openid
    } = app.globalData
    wx.getStorage({
      key: openid + '-userinfo',
      success(res) {
        console.log(res)
        const {
          nickname,
          avatarFileId
        } = res.data
        //const nickname=res.data.nickname
        //const avatarFileId=res.data.avatarFileId
        console.log(nickname, avatarFileId)
        console.log(nickname)
        if (nickname ===""||avatarFileId==="") {
          ///console.log(res.data.nickName)
          console.log("123")
          setTimeout(() => {
            wx.navigateTo({
              url: '../userinfo/userinfo',
            })
          }, 1500)
        }
        else{
        // 如果用户信息存在，那么就跳转到发博客页面
        wx.navigateTo({
          url: `../blog-edit/blog-edit?nickName=${nickname}&avatarUrl=${avatarFileId}`,
        })
      }
      },
      fail() {
        // 如果不存在用户信息，就跳转到用户信息配置页面
        wx.showToast({
          icon: 'loading',
          title: '请配置用户信息',
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../userinfo/userinfo',
          })
        }, 1500)
      }
    })
    //判断用户是否授权
    /*wx.getSetting({
      success:(res)=>{
        console.log(res)
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success(res){
              console.log(res)
            }
          })
        }
        else{
          this.setData({
            modalShow:true
          })
        }
      }
    })*/
  },
  //授权成功
  onLoginSuccess: function (event) {
    console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  //授权失败
  onLoginFail: function () {
    wx.showModal({
      title: '授权用户才能发布',
      content: ''
    })
  },
  //跳转到评论界面
  enterComment: function (event) {
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
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
    this.setData({
      blogList: []
    })
    this.loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: ''
    }
  }
})