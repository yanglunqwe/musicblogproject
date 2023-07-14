const formatTime = require("../../utils/formatTime")
// pages/playlist/playlist.js
import runtime from "../../utils/runtime"
const MAX_LIMIT = 15
let songs = []
let singers = []
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '', //输入框搜索关键值
    smusiclist: [], //搜索到的歌曲信息
    back: true, //返回箭头是否显示
    pshow: true, //歌单列表是否展示
    smshow: false, //搜索的歌曲列表是否显示
    //yy:[],
    banner: [],
    playlist: [],
    swiperImgUrls:[]
  },
  //返回原始界面
  onBack() {
    this.setData({
      pshow: true,
      smshow: true,
      back: true
    })
  },
  //歌曲搜索功能
  onSearch(event) {
    console.log(event.detail.keyword)
    this.setData({
      keyword: event.detail.keyword
    })
    let w = this.data.keyword
    if (w.trim() != '') {
      //发起网络请求
      wx.request({
        url: "https://music.163.com/api/search/get?s=" + w + "&type=1&limit=15",
        success: ((res) => {
          if (JSON.stringify(res.data.result) === "{}") {
            //console.log('123')
            wx.showModal({
              title: '未搜到相关歌曲',
              content: ''
            })
          } else {
            //if(res.data.result)
            for (let i = 0; i < res.data.result.songs.length; i++) {
              singers.push(res.data.result.songs[i].artists[0].name)
            }
            //console.log(singers)
            console.log(res.data.result.songs)
            songs = res.data.result.songs
            if (songs) {
              this.setData({
                //smusiclist: smusiclist,
                pshow: false,
                back: false,
                smshow: false
              })
            } else {
              wx.showModal({
                title: '未搜到相关歌曲',
                content: ''
              })
            }
            this.getsongsdetail()
          }
        })
      })
      //console.log(singers)
    }

  },
  //获取歌曲详情
  getsongsdetail() {
    var arr = []
    for (let i = 0; i < songs.length; i++) {
      if (songs[i].id) {
        console.log(songs[i].id)
        /*wx.request({
          url: `https://apis.imooc.com/song/detail?ids=${songs[i].id}&icode=1222A25D98250346`,
          success: ((res) => {
            //console.log(res)
            //console.log(res.data.songs[0].al.picUrl)
            arr.push(res.data.songs[0].al.picUrl)
    
          })
        })*/
        wx.cloud.callFunction({
          name: 'music',
          data: {
            musiclistIds: songs[i].id,
            $url: 'detail'
          }
        }).then((res) => {
          //console.log(res)
          //console.log(res.result.songs[0].al.picUrl)
          arr.push(res.result.songs[0].al.picUrl)
        })
      }
    }
    console.log(arr)
    const smusiclist = [songs, arr, singers]
    console.log(smusiclist)
    setTimeout(() => {
      this.setData({
        smusiclist: smusiclist
      })
      console.log(arr.length)
      console.log(smusiclist)
      this.setMusiclist() //存储搜索到的歌曲数据 
    }, 1000)
  },
  //存储歌曲数据
  setMusiclist() {
    wx.setStorageSync('musiclist', this.data.smusiclist)
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanner()
    this._getPlaylist()
  },
  //获取banner
  getbanner: function () {
    db.collection('swiper').get().then((res)=>{
      console.log(res)
      this.setData({
        swiperImgUrls: res.data
      })
    })
  },
  _getPlaylist: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist',
      }
    }).then((res) => {
      console.log(res)
      //console.log(res.result.data.createTime)
      for (let i = 0; i < res.result.data.length; i++) {
        console.log(typeof (res.result.data[i].createTime))
      }
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
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
      playlist: []
    })
    this._getPlaylist()
    this.getbanner()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})