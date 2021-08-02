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

