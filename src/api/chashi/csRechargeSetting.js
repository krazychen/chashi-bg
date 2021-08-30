import request from '@/utils/request'

// 获取充值设置列表
export function getRechargeSettingList(data) {
  return request({
    url: '/csRechargeSetting/getPageList',
    method: 'post',
    data
  })
}

// 创建充值设置
export function createRechargeSetting(data) {
  return request({
    url: '/csRechargeSetting/add',
    method: 'post',
    data
  })
}

// 更新充值设置
export function updateRechargeSetting(data) {
  return request({
    url: '/csRechargeSetting/update',
    method: 'post',
    data
  })
}

// 删除充值设置
export function deleteRechargeSetting(id) {
  return request({
    url: '/csRechargeSetting/delete/' + id,
    method: 'post'
  })
}

// 修改充值设置状态
export function updateStatusById(data) {
  return request({
    url: '/csRechargeSetting/updateStatus/',
    method: 'post',
    data
  })
}

