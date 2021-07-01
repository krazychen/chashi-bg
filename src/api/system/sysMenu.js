import request from '@/utils/request'

// 获取用户列表
export function getSysMenuList(data) {
  return request({
    url: '/sysMenu/getPageList',
    method: 'post',
    data
  })
}

// 获取精简版的菜单树形结构
export function getSysMenuSimplifyPageList(data) {
  return request({
    url: '/sysMenu/getSysMenuSimplifyPageList',
    method: 'post',
    data
  })
}

// 创建菜单
export function createSysMenu(data) {
  return request({
    url: '/sysMenu/add',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateSysMenu(data) {
  return request({
    url: '/sysMenu/update',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteSysMenu(id) {
  return request({
    url: '/sysMenu/delete/' + id,
    method: 'post'
  })
}

export function deleteMenus(data) {
  return request({
    url: '/sysMenu/delete/',
    method: 'post',
    data
  })
}

// 获取角色绑定的菜单
export function getSysMenuByRoleId(data) {
  return request({
    url: '/sysMenu/getSysMenuByRoleId/',
    method: 'post',
    data
  })
}

// 获取用户绑定的菜单
export function getSysMenuByUserId(data) {
  return request({
    url: '/sysMenu/getSysMenuByUserId/',
    method: 'post',
    data
  })
}

