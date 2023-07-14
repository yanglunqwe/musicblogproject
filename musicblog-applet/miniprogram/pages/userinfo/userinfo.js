const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl, // 头像临时地址
    avatarFileId: '' // 头像在云存储中的永久地址
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    // 注意：图片只支持<1M图片，超过1M会失败
    // 注意：avatarUrl获取到的是临时地址！临时地址！临时地址！
    // 所以如果想永久使用这个头像地址，可以上传到云存储中得到永久地址
    this.uploadFile()
  },
  uploadFile() {
    // 文件扩展名
    const suffix = /\.\w+$/.exec(this.data.avatarUrl)[0]
    wx.cloud.uploadFile({
      cloudPath: 'avatar/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
      filePath: this.data.avatarUrl,
      success: res => {
        this.data.avatarFileId = res.fileID
      },
      fail: err => console.error(err)
    })
  },
  formSubmit(e) {
    const {
      nickname
    } = e.detail.value
    // 保存头像和昵称
    // 可以保存在云数据库中或者本地存储，这里以本地存储为例
    const {
      openid
    } = app.globalData
    wx.setStorage({
      key: openid + '-userinfo', // 增加一个-userinfo后缀，以区分本地存储中的音乐信息
      data: {
        nickname,
        avatarFileId: this.data.avatarFileId
      },
      success() {
        wx.showToast({
          icon: 'success',
          title: '保存成功',
        })
        setTimeout(wx.navigateBack, 1500)
      },
      fail() {
        wx.showToast({
          icon: 'error',
          title: '保存失败',
        })
      }
    })
  },
})