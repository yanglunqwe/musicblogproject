// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object
  },
  //通过数据监听器对时间进行格式化处理
  observers:{
    ['blog.createTime'](val){
      if(val){
        //console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))
        })
        //console.log(this.data._createTime)
      }
    },
    ['blog'](val){
      console.log(val)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createTime:'' //格式化之后的时间类型
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //图片预览
    onPreviewImage:function(event){
      const ds=event.target.dataset
      wx.previewImage({
        urls: ds.imgs, //所有图片路径
        current:ds.imgsrc //当前图片路径
      })
    }
  }
})
