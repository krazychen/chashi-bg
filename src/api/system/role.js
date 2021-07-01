import request from '@/utils/request'

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: 'sysRole/getPageList',
    method: 'post',
    data
  })
}

// 获取精简版的菜单树形结构
export function updateStateById(data) {
  return request({
    url: '/sysRole/updateState',
    method: 'post',
    data
  })
}

// 创建字典值
export function createRole(data) {
  return request({
    url: '/sysRole/add',
    method: 'post',
    data
  })
}

// 更新字典值
export function updateRole(data) {
  return request({
    url: '/sysRole/update',
    method: 'post',
    data
  })
}

// 删除字典值
export function deleteRole(id) {
  return request({
    url: '/sysRole/delete/' + id,
    method: 'post'
  })
}

// 批量删除字典值
export function deleteRoles(data) {
  return request({
    url: '/sysRole/delete/',
    method: 'post',
    data
  })
}

// 角色批量关联菜单
export function addRoleAndMenu(data) {
  return request({
    url: '/sysRoleMenu/addRoleAndMenu/',
    method: 'post',
    data
  })
}

// 角色批量关联用户
export function addRoleAndUser(data) {
  return request({
    url: '/sysUserRole/addRoleAndUser/',
    method: 'post',
    data
  })
}

// 删除角色和用户的关联
export function deleteSysUserRole(data) {
  return request({
    url: '/sysUserRole/deletes/',
    method: 'post',
    data
  })
}

// 批量角色关联批量用户
export function addRolesUser(data) {
  return request({
    url: '/sysUserRole/addRolesUser/',
    method: 'post',
    data
  })
}
