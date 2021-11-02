import request from '@/utils/request'

// 获取参数配置列表
export function getConfigList(data) {
  return request({
    url: '/sysConfig/getPageList',
    method: 'post',
    data
  })
}

// 创建图片参数配置
export function createPicConfig(data) {
  return request({
    url: '/sysConfig/addConfigPic',
    method: 'post',
    data
  })
}

// 创建图片参数配置
export function updatePicConfig(data) {
  return request({
    url: '/sysConfig/updateConfigPic',
    method: 'post',
    data
  })
}

// 创建参数配置
export function createConfig(data) {
  return request({
    url: '/sysConfig/add',
    method: 'post',
    data
  })
}

// 更新参数配置
export function updateConfig(data) {
  return request({
    url: '/sysConfig/update',
    method: 'post',
    data
  })
}

// 删除参数配置
export function deleteConfig(id) {
  return request({
    url: '/sysConfig/delete/' + id,
    method: 'post'
  })
}

// 获取缓存的参数配置
export function getAllConfigDataCache() {
  return request({
    url: '/sysConfig/getAllConfigDataCache/',
    method: 'post'
  })
}
