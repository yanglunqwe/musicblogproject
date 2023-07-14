//将小程序端的appid以及秘钥获取到封装成httpapi
const rp = require('request-promise')
const APPID = 'wx7ff6066bc26f8eba'
const APPSECRET = '0c32d7550dbe6c380cac949a40328cd5'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')
//console.log(fileName)

const updateAccessToken = async () => {
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    console.log(res)
    //console.log('123')
    //写文件
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            //把获得的接口信息存储在json文件中
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}
//取token方法
const getAccessToken = async () => {
    //读文件
    try {
        const readRes = fs.readFileSync(fileName, 'utf8')
        const readObj = JSON.parse(readRes)
        console.log(readObj);
        const createTime=new Date(readObj.createTime).getTime
        const nowTime=new Date().getTime()
        if((nowTime-createTime)/1000/60/60>=2){
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    }catch(error){
        await updateAccessToken()
        await getAccessToken()
    }
}
setInterval(async()=>{
    await updateAccessToken()
},(7200-300)*1000)
//getAccessToken()
console.log(getAccessToken())
//updateAccessToken()
module.exports=getAccessToken