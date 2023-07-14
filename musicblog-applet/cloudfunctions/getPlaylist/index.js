// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const axios = require('axios')
const URL = 'https://apis.imooc.com/personalized?icode=1222A25D98250346'
const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100
/*
1.逐量分批次提取云数据库中的数据，最终提取到云数据库中所有的数据
2.获取服务器端的最新歌曲数据，并判断歌曲数据接口是否正确
3.云数据库中所有获取到的数据与服务器端最新的歌曲数据进行比较，去重
4.整体得到的歌曲数据添加一个createtime属性并一次性插入到云数据库中
*/
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await playlistCollection.count()
  const total = countResult.total//获取云数据库中总的数据条数
  const batchTimes = Math.ceil(total / MAX_LIMIT)//取数据的次数
  const tasks = [] //将每次取到的数据放入到tasks数组中
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 更新代码: axios发送请求，请求新的URL
  //ES6语法，判断使用的code是否正确
  const {
    data
  } = await axios.get(URL)
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0
  }

  //歌曲数据去重处理
  const playlist = data.result
  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true//标志位表示不重复
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      //如果服务端请求的数据与数据库已有的数据重复，结束当前循环
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    //遍历完成后，再增加一个createTime属性，得到最终的结果插入到newDate数组中
    if (flag) {
      // 更新代码: 给每个歌单信息增加createTime属性
      let pl = playlist[i]
      pl.createTime = db.serverDate()
      // newData.push(playlist[i])
      newData.push(pl)
    }
  }
  //console.log(newData)
  //使用扩展运算符一次插入，只操作数据库一次，提高效率
  console.log([...newData])
  // 更新代码: 一次性批量插入数据
  if (newData.length > 0) {
    await playlistCollection.add({
      data: [...newData]
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log(err)
      console.error('插入失败')
    })
  }
  return newData.length
}