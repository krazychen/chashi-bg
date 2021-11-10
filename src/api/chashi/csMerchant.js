import request from '@/utils/request'

// 获取商店列表
export function getMerchantList(data) {
  return request({
    url: '/csMerchant/getPageList',
    method: 'post',
    data
  })
}

// 创建商店图片
export function createMerchantPic(data) {
  return request({
    url: '/csMerchant/addCsMerchant',
    method: 'post',
    data
  })
}

// 创建商店
export function createMerchant(data) {
  return request({
    url: '/csMerchant/add',
    method: 'post',
    data
  })
}

// 更新商店
export function updateMerchant(data) {
  return request({
    url: '/csMerchant/updateCsMerchant',
    method: 'post',
    data
  })
}

// 删除商店
export function deleteMerchant(id) {
  return request({
    url: '/csMerchant/delete/' + id,
    method: 'post'
  })
}

// 修改商店状态
export function updateStatusById(data) {
  return request({
    url: '/csMerchant/updateStatus/',
    method: 'post',
    data
  })
}

// 获取商店
export function getMerchant(id) {
  return request({
    url: '/csMerchant/infoByOffice/' + id,
    method: 'get'
  })
}

// 获取保洁信息
export function getCleanList(data) {
  return request({
    url: '/csMerchantNotify/getPageList',
    method: 'post',
    data
  })
}

// 创建保洁信息
export function createCleanObj(data) {
  return request({
    url: '/csMerchantNotify/add',
    method: 'post',
    data
  })
}

// 更新保洁信息
export function updateCleanObj(data) {
  return request({
    url: '/csMerchantNotify/update',
    method: 'post',
    data
  })
}
