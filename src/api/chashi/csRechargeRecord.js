import request from '@/utils/request'

// 获取充值记录列表
export function getRechargeRecordList(data) {
  return request({
    url: '/csRechargeRecord/getPageList',
    method: 'post',
    data
  })
}

// 创建充值记录
export function createRechargeRecord(data) {
  return request({
    url: '/csRechargeRecord/add',
    method: 'post',
    data
  })
}

// 更新充值记录
export function updateRechargeRecord(data) {
  return request({
    url: '/csRechargeRecord/update',
    method: 'post',
    data
  })
}

// 删除充值记录
export function deleteRechargeRecord(id) {
  return request({
    url: '/csRechargeRecord/delete/' + id,
    method: 'post'
  })
}

// 修改充值记录状态
export function updateStatusById(data) {
  return request({
    url: '/csRechargeRecord/updateStatus/',
    method: 'post',
    data
  })
}

