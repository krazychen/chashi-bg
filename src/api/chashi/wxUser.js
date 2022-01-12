import request from '@/utils/request'

// 获取微信用户
export function getWxUserList(data) {
  return request({
    url: '/wxUser/getPageList',
    method: 'post',
    data
  })
}

// 创建微信用户
export function createWxUser(data) {
  return request({
    url: '/wxUser/add',
    method: 'post',
    data
  })
}

// 更新微信用户
export function updateWxUser(data) {
  return request({
    url: '/wxUser/update',
    method: 'post',
    data
  })
}

// 删除微信用户
export function deleteWxUser(id) {
  return request({
    url: '/wxUser/delete/' + id,
    method: 'post'
  })
}

// 修改微信用户状态
export function updateStatusById(data) {
  return request({
    url: '/wxUser/updateStatus/',
    method: 'post',
    data
  })
}

// 修改微信用户状态
export function getWxUser(id) {
  return request({
    url: '/wxUser/info/' + id,
    method: 'get'
  })
}

// 手工增加余额
export function addCsRechargeRecord(data) {
  return request({
    url: '/csRechargeRecord/add',
    method: 'post',
    data
  })
}

