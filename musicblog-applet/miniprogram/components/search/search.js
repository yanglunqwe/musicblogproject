// components/search/search.js
let keyword='' //搜索输入关键字
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'请输入关键字'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //用户输入文本事件
    onInput:function(event){
      keyword=event.detail.value
    },
    //用户点击搜索按钮事件
    onSearch:function(){
      console.log(keyword)
      this.triggerEvent('search',{
        keyword
      })
    }
  }
})
