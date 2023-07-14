//const { resolve, reject } = require("bluebird")

// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM=140 //定义最大输入文字个数
const MAX_IMG_NUM=9 //定义最大上传图片数量
const db=wx.cloud.database() //初始化数据库
let content='' //定义输入的文本内容
let userInfo={} //定义接收到的用户信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //输入的文字个数
    wordsNum:0,
    //定义底部footer到底部的距离
    footerBottom:0,
    //定义选择的图片数组
    images:[],
    //表示添加图片元素(加号)是否显示
    selectDisplay:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo=options
  },
  //文字输入
  onInput(event){
    //console.log(event.detail.value)
    let wordsNum=event.detail.value.length
    //判断输入文字是否超出最大限度
    if(wordsNum>=MAX_WORDS_NUM){
      wordsNum=`最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum:wordsNum
    })
    content=event.detail.value
  },
  //获取焦点，键盘弹起
  onFocus:function(event){
    this.setData({
      footerBottom:event.detail.height
    })
  },
  //失去焦点，键盘退出
  onBlur:function(){
    this.setData({
      footerBottom:0
    })
  },
  //选择图片
  onChooseImage:function(){
    //还能再选择的图片数量
    let residue=MAX_IMG_NUM-this.data.images.length
    //通过wx.chooseImageAPI选择图片
    wx.chooseImage({
      count: residue,
      sizeType:['original','compressed'], //表示初始值和压缩过的
      sourceType:['album','camera'], //表示从手机相册选择和拍照选择
      success:(res)=>{
        console.log(res)
        this.setData({
          images:this.data.images.concat(res.tempFilePaths)
        })
        //还能再选几张图片
        residue=MAX_IMG_NUM-this.data.images.length
        //判断加号是否显示
        this.setData({
          selectDisplay:residue<=0?false:true
        })
      }
    })
  },
  //预览图片
  onPreviewImage:function(event){
    //通过wx.previewImage接口实现图片预览功能
    wx.previewImage({
      urls: this.data.images,
      current:event.target.dataset.imgsrc
    })
  },
  //删除图片
  onDelImage:function(event){
    this.data.images.splice(event.target.dataset.index,1)
    this.setData({
      images:this.data.images
    })
    if(this.data.images.length==MAX_IMG_NUM-1){
      this.setData({
        selectDisplay:true
      })
    }
  },
  //上传图片
  send:function(){
    /*数据->云数据库
    数据库：内容、图片fileID、openid、昵称、头像、时间
    图片->云存储 fileID 云文件ID
    */ 
   //判断输入的文本是否为空或空格
   if(content.trim()===''){
     wx.showModal({
       title:'请输入内容',
       content:''
     })
     return
   }
   //用户上传等待
   wx.showLoading({
     titel:'发布中',
     mask:true
   })
   let promiseArr=[] //用户将文件上传到云存储的所有事件
   let fileIds=[] //云存储返回的所有文件id集
   for(let i=0,len=this.data.images.length;i<len;i++){
     let p=new Promise((resolve,reject)=>{
      let item=this.data.images[i]
      //正则匹配文件扩展名
      let suffix=/\.\w+$/.exec(item)[0]
      //将文件上传到云存储
      wx.cloud.uploadFile({
       cloudPath:'blog'+Date.now()+'-'+Math.random()*1000000+suffix, //云端路径
       filePath:item,  //文件临时路径
       success:(res)=>{
         console.log(res.fileID)
         fileIds=fileIds.concat(res.fileID)
         resolve()
       },
       fail:(err)=>{
         console.log(err)
         reject()
       }
      })
     })
     promiseArr.push(p) //将所有文件id存放到数组中
   }
   //所有图片上传到云存储并返回所有存储文件id后，将各个信息存储到云数据库中
   Promise.all(promiseArr).then((res)=>{
     db.collection('blog').add({
       data:{
        ...userInfo, //用户信息
        content,    //文本内容
        img:fileIds, //所有上传到云存储并返回的文件id
        createTime:db.serverDate() //上传到服务端的时间
       }
     }).then((res)=>{
       //console.log(res)
       wx.hideLoading()
       wx.showToast({
         title: '发布成功',
       })
       //返回blog页面并且刷新
       wx.navigateBack()
       const pages=getCurrentPages() //上个页面和当前页面的数组
       console.log(pages)
       //取上一个页面
       const prevPage=pages[pages.length-2]
       prevPage.onPullDownRefresh()
     }).catch((err)=>{
       wx.hideLoading()
       wx.showToast({
         title: '发布失败',
       })
     })
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