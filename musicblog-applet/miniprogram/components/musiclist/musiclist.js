// components/musiclist/musiclist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playmusicId:-1,
    index:-1
  },
  pageLifetimes:{
    show(){
      this.setData({
        playmusicId: parseInt(app.getPlayMusicId())
      })    
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      console.log(event)
      console.log(event.currentTarget.dataset.musicid)
      console.log(event.currentTarget.dataset.index)
      this.setData({
        playmusicId:event.currentTarget.dataset.musicid,
        index:event.currentTarget.dataset.index
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${this.data.playmusicId}&index=${this.data.index}`,
      })
    }
  }
})
