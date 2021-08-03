import request from '@/utils/request'

// 获取广告列表
export function getAdvertiseList(data) {
  return request({
    url: '/csAdvertise/getPageList',
    method: 'post',
    data
  })
}

// 创建广告
export function createAdvertise(data) {
  return request({
    url: '/csAdvertise/add',
    method: 'post',
    data
  })
}

// 更新广告
export function updateAdvertise(data) {
  return request({
    url: '/csAdvertise/update',
    method: 'post',
    data
  })
}

// 删除广告
export function deleteAdvertise(id) {
  return request({
    url: '/csAdvertise/delete/' + id,
    method: 'post'
  })
}

// 修改广告状态
export function updateStatusById(data) {
  return request({
    url: '/csAdvertise/updateStatus/',
    method: 'post',
    data
  })
}

