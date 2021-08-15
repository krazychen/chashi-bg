import request from '@/utils/request'

// 获取会员卡用户列表
export function getMembercardOrderList(data) {
  return request({
    url: '/csMembercardOrder/getPageList',
    method: 'post',
    data
  })
}

// 购买会员卡
export function createMembercardOrder(data) {
  return request({
    url: '/csMembercardOrder/add',
    method: 'post',
    data
  })
}

// 删除会员卡购买记录
export function deleteMembercardOrder(id) {
  return request({
    url: '/csMembercardOrder/delete/' + id,
    method: 'post'
  })
}


