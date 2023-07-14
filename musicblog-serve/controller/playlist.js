//将云端的数据获取到，通过路由的方式将信息导出，app使用路由方法即可获取数据，
//app通过监听端口配置对应下的路由路径，即可获取对应的网址
const Router=require('koa-router')
const router=new Router()
const callCloudFn=require('../utils/callCloudFn')
const callCloudDB=require('../utils/callCloudDB.js')
    router.get('/list', async (ctx, next) => {
        const query = ctx.request.query
        const res = await callCloudFn(ctx, 'music', {
            $url: 'playlist',
            start: parseInt(query.start),
            count: parseInt(query.count)
        })
        let data = []
        if (res.resp_data) {
            data = JSON.parse(res.resp_data).data
        }

        ctx.body = {
            data,
            code: 20000,
        }
    })
    router.get('/getById',async(ctx,next)=>{
        const query=`db.collection('playlist').doc('${ctx.request.query.id}').get()`
        const res=await callCloudDB(ctx,'databasequery',query)
        ctx.body={
            code:20000,
            data:JSON.parse(res.data)
        }
    })
    router.post('/updatePlaylist',async(ctx,next)=>{
        const params=ctx.request.body
        const query=`
        db.collection('playlist').doc('${params._id}').update({
            data:{
                name:'${params.name}',
                copywriter:'${params.copywriter}'
            }
        })
         `
         const res=await callCloudDB(ctx,'databaseupdate',query)
         ctx.body={
            code:20000,
            data:res
         }
    })
    //删除方法
    router.get('/del',async(ctx,next)=>{
        const params=ctx.request.query
        //数据库操作语句
        const query=`db.collection('playlist').doc('${params.id}').remove()`
        //获取数据库方法获取新数据
        const res=await callCloudDB(ctx,'databasedelete',query)
        ctx.body={
            code:20000,
            data:res
        }
    })
module.exports=router