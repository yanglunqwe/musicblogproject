// components/lyric/lyric.js
//当前歌词的高度
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },
  //属性监听器
  observers: {
    lyric(lrc) {
      if (lrc == "暂无歌词") {
        this.setData({
          lycTime: [],
          nowLyricIndex: -1
        })
      } else {
        //console.log(lrc)
        //调用解析歌词的方法
        this.parseLyric(lrc)
      }
      //console.log(lrc)
      //调用解析歌词的方法
      this.parseLyric(lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //定义歌词与时间数组
    lycTime: [],
    // 当前选中的歌词的索引
    nowLyricIndex: 0,
    //滚动条滚动的高度
    scrollTop: 0
  },
  lifetimes: {
    ready() {
      //获取当前的机型信息
      wx.getSystemInfo({
        success(res) {
          console.log(res)
          //对歌词高度进行换算，转化为px单位
          lyricHeight = res.screenWidth / 750 * 80
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    parseLyric(songlrc) {
      //console.log(songlrc)
      //定义歌词与时间数组
      let lyc_Time = []
      //按照空格对歌词进行切分
      let lyclist = songlrc.split('\n')
      //console.log(lyclist)
      //按照正则表达式分离出时间
      const re = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
      //遍历歌词
      lyclist.forEach(item => {
        if (item != null) {
          //提取出每一个经正则处理的项
          let items = item.match(re)
          //console.log(items)
          if (items != null) {
            //提取所有的歌曲时间
            //整理时间，剔除中括号
            let time = items[0].slice(1, -1)
            //console.log(time)
            //将时间转化为有意义的分秒，按冒号切分
            const timelist = time.split(":")
            const min = timelist[0]
            const sec = timelist[1]
            //获取最终的时间
            const finTime = parseFloat(min) * 60 + parseFloat(sec)
            //console.log(finTime)
            //找歌词，替换方法把时间的清除掉
            const songLrc = item.replace(re, "")
            //console.log(songlrc)
            lyc_Time.push([finTime, songLrc])
            //console.log(lyc_Time)
          }
        }
      })
      this.setData({
        lycTime: lyc_Time
      })
    },
    //获取从歌曲进度条组件传递的当前歌曲时间
    update: function (currentTime) {
      console.log(currentTime)
      //获取歌词+时间数组
      let lrcTime = this.data.lycTime
      if (lrcTime.length == 0) {
        return
      }
      //当前歌曲时间如果大于歌词时间数组内时间
      if (currentTime > lrcTime[lrcTime.length - 1][0]) {
        //让歌词能滚动到最后
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcTime.length * lyricHeight
          })
        }
      }
      for (let i = 0, len = lrcTime.length; i < len; i++) {
        if (currentTime <= lrcTime[i][0]) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    }
  }
})