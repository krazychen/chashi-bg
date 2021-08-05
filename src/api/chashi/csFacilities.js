import request from '@/utils/request'

// 获取服务设施列表
export function getFacilitiesList(data) {
  return request({
    url: '/csFacilities/getPageList',
    method: 'post',
    data
  })
}

// 创建服务设施
export function createFacilities(data) {
  return request({
    url: '/csFacilities/add',
    method: 'post',
    data
  })
}

// 更新服务设施
export function updateFacilities(data) {
  return request({
    url: '/csFacilities/update',
    method: 'post',
    data
  })
}

// 删除服务设施
export function deleteFacilities(id) {
  return request({
    url: '/csFacilities/delete/' + id,
    method: 'post'
  })
}

// 修改服务设施状态
export function updateStatusById(data) {
  return request({
    url: '/csFacilities/updateStatus/',
    method: 'post',
    data
  })
}

