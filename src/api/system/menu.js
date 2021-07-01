import request from '@/utils/request'

// 根据ID获取菜单信息
export function getInfo(menuCode) {
  return request({
    url: '/sysMenu/info/' + menuCode,
    method: 'get'
  })
}

// 获取菜单列表
export function getPageList(data) {
  return request({
    url: '/sysMenu/getPageList',
    method: 'post',
    data
  })
}

// 创建菜单
export function createMenu(data) {
  return request({
    url: '/sysMenu/add',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/sysMenu/update',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteMenu(menuCode) {
  return request({
    url: '/sysMenu/delete/' + menuCode,
    method: 'post'
  })
}
