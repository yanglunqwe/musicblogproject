import request from '@/utils/request'
const baseURL='http://localhost:3000'
export function fetchList(params){
    return request({
        params,
        url:`${baseURL}/playlist/list`,
        method:'get'
    })
}
//通过id对数据进行查询
export function fetchById(params){
    return request({
        params,
        url:`${baseURL}/playlist/getById`,
        method:'get',
    })
}
//多后端数据进行修改
//把表单里的信息提交给后端
export function update(params){
    return request({
        url:`${baseURL}/playlist/updatePlaylist`,
        data:{
            ...params
        },
        method:'post',
    })
}
//删除的方法
export function del(params){
    return request({
        params,
        url:`${baseURL}/playlist/del`,
        method:'get',
    })
}