// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blog:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    //登录组件是否显示
    loginShow:false,
    //底部弹出是否显示
    modalShow:false,
    content:'',
    nickName:'', //用户昵称
    avatarUrl:'' //用户头像
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //用户评论
    onComment() {
      // 20221128小程序用户头像昵称获取规则调整
      // 判断本地存储中是否有用户信息
      // 用户信息在本地存储，key为openid + '-userinfo'
      /*this.setData({
        loginShow:true
      })*/
      const {
        openid
      } = app.globalData
      wx.getStorage({
        key: openid + '-userinfo',
        success: (res) => {
          console.log(res)
          this.setData({
            nickName:res.data.nickname,
            avatarUrl:res.data.avatarFileId
          })
          /*const {
            nickname,
            avatarFileId
          } = res.data
          this.data.nickname = nickname
          this.data.avatarUrl = avatarFileId*/
          // 如果用户信息存在，那么订阅消息
         this.subscribeMsg()
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
      // this.setData({
      //   loginShow: true,
      // })
      // 判断用户是否授权
      /* wx.getSetting({
        success: (res) => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      }) */
    },
     //调起客户端小程序订阅消息界面
    subscribeMsg() {
      const tmplId = '0oUOgSoqYRfWMRfHPj9cDVNpjcYnZhFvvNuzIdz336U'
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: (res) => {
          console.log(res)
          if (res[tmplId] === 'accept') {
            // this.onComment()
            this.setData({
              modalShow: true,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '订阅失败，无法评论',
            })
          }
        }
      })
    },
    //权限成功
    onLoginsuccess(event) {
      userInfo = event.detail
      console.log(event)
      userInfo = event.detail
      console.log(userInfo)
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true,
        })
      })
    },
    //权限失败
    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },
    //用户输入评论
    onInput(event){
      this.setData({
        content:event.detail.value
      })
    },
    //用户发送评论
    onSend(event){
      let content=this.data.content
      if(content.trim()==''){
        wx.showModal({
          title:'评论内容不能为空',
          content:'',
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask:true
      })
      db.collection('blog-comment').add({
        data:{
          content,
          createTime:db.serverDate(),
          blogId:this.properties.blogId,
          nickName:this.data.nickName,
          avatarUrl:this.data.avatarUrl
        }
      }).then((res)=>{
        //推送订阅消息
        console.log(res)
        wx.cloud.callFunction({
          name:'subscribeMsg',
          data:{
            content,
            blogId:this.properties.blogId
          }
        })
      }).then((res)=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow:false,
          content:''
        })
        //父元素刷新评论列表
        this.triggerEvent('refreshComment')
      })
    }
  }
})
