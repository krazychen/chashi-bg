import request from '@/utils/request'

// 获取优惠卷列表
export function getCouponList(data) {
  return request({
    url: '/csCoupon/getPageList',
    method: 'post',
    data
  })
}

// 创建优惠卷
export function createCoupon(data) {
  return request({
    url: '/csCoupon/add',
    method: 'post',
    data
  })
}

// 更新优惠卷
export function updateCoupon(data) {
  return request({
    url: '/csCoupon/update',
    method: 'post',
    data
  })
}

// 删除优惠卷
export function deleteCoupon(id) {
  return request({
    url: '/csCoupon/delete/' + id,
    method: 'post'
  })
}

// 修改优惠卷状态
export function updateStatusById(data) {
  return request({
    url: '/csCoupon/updateStatus/',
    method: 'post',
    data
  })
}

// 创建优惠卷发放记录
export function createReleasedCoupon(data) {
  return request({
    url: '/csCouponReleased/batchedAdd',
    method: 'post',
    data
  })
}

// 获取用户有效的优惠卷
export function getReleasedCouponForUser(wxuserId) {
  return request({
    url: '/csCouponReleased/getCouponForWx/' + wxuserId,
    method: 'get'
  })
}

