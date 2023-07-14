// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const axios = require('axios')
const BASE_URL = 'https://apis.imooc.com'
const ICODE = 'icode=1222A25D98250346'
/*cloud.init({
  env: 'test-4gl7utre881a508f'
})*/
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  //歌曲banner轮播图路由
  /*app.router('banner', async (ctx, next) => {
    ctx.body = await cloud.database().collection('banner')
      .skip(event.start)
      .limit(event.count)
      //.orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        console.log(res)
        return res

      })
  })*/
  //不同类型歌曲路由
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        console.log(res)
        return res

      })
  })
  //歌曲列表路由
  app.router('musiclist', async (ctx, next) => {
    const res = await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}&${ICODE}`)
    ctx.body = res.data
  })
  //获取歌曲详情
  app.router('detail',async(ctx,next)=>{
    const res = await axios.get(`${BASE_URL}/song/detail?ids=${event.musiclistIds}&${ICODE}`)
    ctx.body = res.data
  })
  //歌曲播放路由
  app.router('play', async(ctx, next) => {
    const res = await axios.get(`${BASE_URL}/song/url?id=${event.musicId}&${ICODE}`)
    ctx.body = res.data
  })
  //获取歌词路由
  app.router('lyric',async(ctx,next)=>{
    const res=await axios.get(`${BASE_URL}/lyric?id=${event.musicId}&${ICODE}`)
    ctx.body=res.data
  })
  return app.serve()
}