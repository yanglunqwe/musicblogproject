// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const axios = require('axios')
const URL = 'https://apis.imooc.com/banner?icode=1222A25D98250346'
const bannerCollection = db.collection('banner')
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    data
  } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const banner=data.banners
  console.log(banner)
  if (banner.length > 0) {
    await bannerCollection.add({
      data: [...banner]
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log(err)
      console.error('插入失败')
    })
  }
  return banner.length
}