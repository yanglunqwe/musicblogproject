const Koa=require('koa')
const app=new Koa()
const Router=require('koa-router')
const router=new Router()

//解决跨域问题
const cors=require('koa2-cors')

//安装koa-body解决前端发送的post请求
const {koaBody}=require('koa-body')

const ENV='test-4gl7utre881a508f'
app.use(cors({
    origin:['http://localhost:9528'],
    credentials:true //证书
}))

app.use(async(ctx,next)=>{
    console.log('全局中间件')
    ctx.state.env=ENV
    await next()
})

//接收post参数解析
app.use(koaBody({
    multipart:true
}))

const playlist=require('./controller/playlist.js')
const swiper=require('./controller/swiper.js')
const blog=require('./controller/blog.js')
router.use('/playlist',playlist.routes())
router.use('/swiper',swiper.routes())
router.use('/blog',blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000,()=>{
    console.log('服务开启在3000端口')
})
//MVC模型视图控制器
