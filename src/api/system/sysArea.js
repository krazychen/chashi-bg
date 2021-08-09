import request from '@/utils/request'

// 获取行政区域
export function getSysAreaList(data) {
  return request({
    url: '/sysArea/getSysAreaPageListLazy',
    method: 'post',
    data
  })
}

// 获取精简版的行政区域树形结构
export function getSysAreaSimplifyPageList(data) {
  return request({
    url: '/sysArea/getSysAreaSimplifyPageList',
    method: 'post',
    data
  })
}

// 获取精简版的行政区域树形结构
export function getSysAreaRedisSimplifyPageList() {
  return request({
    url: '/sysArea/getSysAreaSimplifyList',
    method: 'post'
  })
}

// 创建行政区域
export function createSysArea(data) {
  return request({
    url: '/sysArea/add',
    method: 'post',
    data
  })
}

// 更新行政区域
export function updateSysArea(data) {
  return request({
    url: '/sysArea/update',
    method: 'post',
    data
  })
}

// 删除行政区域
export function deleteSysArea(id) {
  return request({
    url: '/sysArea/delete/' + id,
    method: 'post'
  })
}

// 删除行政区域批量
export function deleteSysAreas(data) {
  return request({
    url: '/sysArea/delete/',
    method: 'post',
    data
  })
}

// 修改行政区域状态
export function updateStatusById(data) {
  return request({
    url: '/sysArea/updateStatus/',
    method: 'post',
    data
  })
}

// 修改行政区域状态
export function getReleaseCity() {
  return request({
    url: '/sysArea/getReleaseCity/',
    method: 'get'
  })
}

