// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
let currentSec = -1 // 当前歌曲播放的秒数
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0, //可移动的距离
    progress: 0 //当前进度条移动的距离
  },
  //组件的生命周期函数
  lifetimes: {
    ready() {
      //判断是否点击的是否是同一首歌曲
      if(this.properties.isSame&&this.data.showTime.totalTime=='00:00'){
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //拖动改变歌曲进度
    onChange(event){
      //若为手动触发，改变当前进度及当前的滑动距离
      if(event.detail.source=='touch'){
        this.data.progress=event.detail.x/(movableAreaWidth-movableViewWidth)*100
        this.data.movableDis=event.detail.x
        isMoving=true
        console.log('change', isMoving)
      }
    },
    //手动触发结束——当前进度条的位置
    onTouchEnd(){
      //获取歌曲当前时间
      const currentTime=Math.floor(backgroundAudioManager.currentTime)
      //对当前时间进行格式化
      const currentTimeFmt=this._dateFormat(currentTime)
      //渲染进度和切换到当前时间改变
      this.setData({
        progress:this.data.progress,
        movableDis:this.data.movableDis,
        ['showTime.currentTime']:currentTimeFmt
      })
      const totalTime=backgroundAudioManager.duration
      //执行滑动到当前位置歌曲播放
      backgroundAudioManager.seek(totalTime*this.data.progress/100)
      isMoving = false
      console.log('end', isMoving)
    },
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth, movableViewWidth)
      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('OnPause')
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        console.log('onTimeUpdate')
        //获取当前播放歌曲时长秒数
        const currentTime = backgroundAudioManager.currentTime
        //console.log(currentTime)
        //获取歌曲总时长秒数
        const duration = backgroundAudioManager.duration
        //对当前歌曲时长秒数进行切割
        const sec = currentTime.toString().split('.')[0]
        if (sec != currentSec) {
          const currentTimeFmt = this._dateFormat(currentTime)
          console.log(currentTimeFmt)
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
            progress: currentTime / duration * 100,
            ['showTime.currentTime']:currentTimeFmt
          })
          currentSec=sec
          //联动歌词,发送当前歌词时间数据
          this.triggerEvent('timeUpdate',{
            currentTime
          })
        }
      })
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent('nextSong') //自动播放下一首
      })
      backgroundAudioManager.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    //获取歌曲总时间
    _setTime() {
      //获取歌曲总时间，单位为秒
      const duration = backgroundAudioManager.duration
      console.log(duration)
      //对歌曲总时间进行格式化
      const totalTimeFmt = this._dateFormat(duration)
      //输出经格式化后的总时间
      console.log(totalTimeFmt)
      this.setData({
        ['showTime.totalTime']:totalTimeFmt
      })
    },
    //对歌曲时间进行格式化
    _dateFormat(time) {
      const min = Math.floor(time / 60)
      const sec = Math.floor(time % 60)
      return this._parse0(min) + ":" + this._parse0(sec)
    },
    //判断歌曲时间是否需要补零
    _parse0(ms) {
      if (ms < 10) {
        return '0' + ms
      } else {
        return ms
      }
    }
  }
})