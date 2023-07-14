// pages/player/player.js
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
//定义所有歌曲背景的路径数组
//let picUrls = []
//定义当前歌曲索引
let musicNowIndex = ''
//定义当前歌曲播放路径
let musicUrl = ''
//定义当前歌曲id
let musicNowId = ''
//定义当前页面所有歌曲id集合
let musicIds = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //设置手指滑动点坐标
    touchS: [0, 0],
    touchE: [0, 0],
    //定义从storage获取到的所有歌曲列表信息，根据歌曲歌曲id或歌曲index提取出每一条歌曲信息，渲染到播放页面上
    musiclist: [],
    //定义封面背景图片
    picUrls: [], //封面路径
    singers: [], //所有歌手姓名
    singer: [],
    picUrl: '',
    //歌曲名字
    musicName: '',
    //current:0,
    //currentIndex:0,
    //歌曲播放路径
    //url: '',
    //默认歌曲为播放模式
    action: {
      method: "play"
    },
    //歌曲歌词
    lyric: '',
    //表示当前歌词是否显示,默认不显示
    isLyricShow: false,
    isSame: false //表示是否是同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前歌曲id和下标
    console.log(options)
    //获取当前歌曲id
    musicNowId = options.musicId
    //获取当前歌曲下标
    musicNowIndex = options.index
    //获取歌曲列表中所有歌曲
    const musiclist = wx.getStorageSync('musiclist')
    console.log(musiclist)
    this.setData({
      musiclist: musiclist[0],
      picUrls: musiclist[1],
      singers: musiclist[2]
    })
    //依次加载所有的歌曲id集,picurl集
    //const picUrls=[]
    for (var i = 0; i < musiclist[0].length; i++) {

      //console.log(musiclist[i].id)
      musicIds.push(musiclist[0][i].id)
      //picUrls.push(musiclist[i].al.picUrl)
    }
    console.log(musicIds)
    //console.log(picUrls)
    /*this.setData({
      picUrls:picUrls
    })*/

    //根据当前歌曲id，加载当前歌曲信息
    this._loadMusicDetail(musicNowId)
  },
  //加载当前歌曲的歌曲信息
  _loadMusicDetail(musicId) {
    if (musicId == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    this.setData({
      action: "pause"
    })
    //根据当前歌曲下标，获取当前歌曲的所有信息
    let musicNowdetail = this.data.musiclist[musicNowIndex]
    let picUrl = this.data.picUrls[musicNowIndex]
    let singer = this.data.singers[musicNowIndex]
    console.log(picUrl)
    console.log(singer)
    console.log(musicNowdetail)
    //获取当前歌曲的歌名
    console.log(musicNowdetail.name)
    //console.log(musicNowdetail.al.picUrl)
    this.setData({
      picUrl: picUrl,
      musicName: musicNowdetail.name,
      singer: singer
    })
    console.log(musicId, typeof (musicId))
    app.setPlayMusicId(musicId)
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'play',
      }
    }).then((res) => {
      console.log(res)
      console.log(res.result)
      musicUrl = res.result.data[0].url
      console.log(musicUrl)
      if (musicUrl != null) {
        console.log(musicUrl)
        if (!this.data.isSame) {
          backgroundAudioManager.src = musicUrl
          backgroundAudioManager.title = this.data.musicName
          backgroundAudioManager.coverImgUrl = this.data.musicUrl
          //歌手姓名
          backgroundAudioManager.singer = this.data.singer
          //专辑名称
          //backgroundAudioManager.epname = musicNowdetail.al.name
          //保存播放历史
          this.savePlayHistory()
        }
        this.setData({
          action: {
            method: 'play'
          }
        })
      } else {
        wx.showToast({
          title: '暂无版权',
          duration: 2000
        })
        setTimeout(()=>{
          this.nextsong()
        },2000)
      }
    })
    wx.hideLoading()
    //加载歌词信息
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'lyric'
      }
    }).then((res) => {
      console.log(res)
      let lyric = '暂无歌词'
      const lrc = res.result.lrc
      if (lrc != null) {
        lyric = lrc.lyric
        //console.log(lrc.lyric)
      }
      this.setData({
        lyric: lyric
      })
    })
  },
  touchStart: function (e) {
    console.log(e)
    //e.preventDe()
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
    let self = this
    self.loop = setTimeout(function () {
      self.loop = 0
    }, 120)
    return false
  },
  touchMove: function (e) {

    console.log(e)
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchE = [sx, sy]
    //console.log('123')
  },
  touchEnd: function (e) {
    let self = this
    console.log(e)
    clearTimeout(self.loop)
    let start = this.data.touchS
    let end = this.data.touchE
    console.log(start)
    console.log(end)
    /*if (self.loop !== 0 || (start[0] < end[0] + 25 && start[0] > end[0] - 25)) {
      console.log('点击事件')
    }*/
    if (self.loop == 0 && (start[0] > end[0] + 30 || start[0] < end[0] - 30)) {
      console.log('滑动事件')
      if (start[0] < end[0] - 30) {
        this.prevsong()
        console.log('右滑动，上一首歌曲')
      } else if (start[0] > end[0] + 30) {
        this.nextsong()
        console.log('左滑动，下一首歌曲')
      }
    } else {
      console.log("点击事件")
    }
  },

  // 控制歌曲状态(播放或者暂停)
  playorpause: function () {
    // 获取当前歌曲的状态 -- 如果是暂停状态改为播放状态
    let musicState = this.data.action.method;
    // 判断当前歌曲的状态
    if (musicState == 'play') {
      // 修改为暂停状态
      backgroundAudioManager.pause()
      this.setData({
        action: {
          "method": "pause"
        }
      })
    } else {
      backgroundAudioManager.play()
      // 修改为播放状态
      this.setData({
        action: {
          "method": 'play'
        }
      })
    }
  },
  //切换上一首歌曲
  prevsong: function () {
    //console.log('123')
    musicNowIndex--
    if (musicNowIndex < 0) {
      musicNowIndex = this.data.musiclist.length - 1
    }
    const currentId = this.data.musiclist[musicNowIndex].id
    console.log(currentId)
    this._loadMusicDetail(currentId)
    this.setData({
      action: {
        "method": 'play'
      }
    })
  },
  //切换下一首歌曲
  nextsong: function () {
    //console.log('123')
    musicNowIndex++
    if (musicNowIndex === this.data.musiclist.length) {
      musicNowIndex = 0
    }
    const currentId = this.data.musiclist[musicNowIndex].id
    console.log(currentId)
    this._loadMusicDetail(currentId)
    this.setData({
      action: {
        "method": 'play'
      }
    })
  },
  //歌词是否显示
  lyricShow: function () {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //进度条组件timeUpdate方法将当前歌词时间传递到歌词组件
  timeUpdate: function (event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //控制全局播放器backgroundAudioManager的状态，使之与页面播放联动
  onPlay() {
    this.setData({
      action: {
        "method": 'play'
      }
    })
  },
  onPause() {
    this.setData({
      action: {
        "method": 'pause'
      }
    })
  },
  //保存歌曲播放历史
  savePlayHistory() {
    const music = this.data.musiclist[musicNowIndex]
    const picUrl = this.data.picUrls[musicNowIndex]
    const singer = this.data.singers[musicNowIndex]
    if (Object.keys(music)[1] == "id") {
      console.log(music)
      const openid = app.globalData.openid
      const history = wx.getStorageSync(openid)
      console.log(typeof (history))
      //console.log(history)
      let tag = false //表示当前歌曲是否存在，默认不存在
      let m = []
      let p = []
      let s = []
      let all = [m, p, s]
      for (let i = 0, len = history.length; i < len; i++) {
        //console.log(history[i][0][0])
        //遍历本地历史存放歌曲中是否有重复歌曲
        if (history[i][0][0].id == music.id) {
          tag = true //歌曲重复
          break //跳出当前循环
        }
      
      }
      //若歌曲不存在，则存放在历史本地中
      if (!tag) {
        m.unshift(music)
        p.unshift(picUrl)
        s.unshift(singer)
        console.log(m)
        console.log(p)
        console.log(s)
        //console.log(all)
        history.unshift(all)
        console.log(history)
        wx.setStorage({
          data: history,
          key: openid,
        })
      }
    }

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