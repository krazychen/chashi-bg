import request from '@/utils/request'

// 获取商店订单列表
export function getMerchantOrderList(data) {
  return request({
    url: '/csMerchantOrder/getPageList',
    method: 'post',
    data
  })
}

// 创建商店订单
export function createMerchantOrder(data) {
  return request({
    url: '/csMerchantOrder/add',
    method: 'post',
    data
  })
}

// 更新商店订单
export function updateMerchantOrder(data) {
  return request({
    url: '/csMerchantOrder/update',
    method: 'post',
    data
  })
}

// 删除商店订单
export function deleteMerchantOrder(id) {
  return request({
    url: '/csMerchantOrder/delete/' + id,
    method: 'post'
  })
}

// 修改商店订单状态
export function updateStatusById(data) {
  return request({
    url: '/csMerchantOrder/updateStatus/',
    method: 'post',
    data
  })
}

// 获取商店订单详情
export function getMerchantOrder(id) {
  return request({
    url: '/csMerchantOrder/info/' + id,
    method: 'get'
  })
}

// 获取茶室时间范围
export function getTimeRange(data) {
  return request({
    url: '/csMerchantOrder/getTimeRange',
    method: 'post',
    data
  })
}

// 获取茶室时间范围
export function getCsMerchantOrderTotal(data) {
  return request({
    url: '/csMerchant/getCsMerchantOrderTotal',
    method: 'post',
    data
  })
}

// 获取统计数据
export function getCsMerchantTotalStatical(id) {
  return request({
    url: '/csMerchant/getCsMerchantTotalStatical',
    method: 'get'
  })
}
