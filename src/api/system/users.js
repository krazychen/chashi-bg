import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 根据ID获取用户信息
export function getInfo(id) {
  return request({
    url: '/sysUser/info/' + id,
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/sysUser/getPageList',
    method: 'post',
    data
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: '/sysUser/add',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/sysUser/update',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/sysUser/delete/' + id,
    method: 'post'
  })
}

// 获取菜单树形结构
export function getParentCodeTrees(data) {
  return request({
    url: '/sysOffice/getParentCodeTree',
    method: 'post',
    data
  })
}

// 修改用户状态
export function stateUpdate(id) {
  return request({
    url: '/sysUser/updateByState/' + id,
    method: 'post'
  })
}

// 批量删除用户
export function deleteUsers(data) {
  return request({
    url: '/sysUser/delete/',
    method: 'post',
    data
  })
}

// 重置密码
export function uPassWord(id) {
  return request({
    url: '/sysUser/uPassWord/' + id,
    method: 'post'
  })
}

// 重置密码
export function passwordSetting(data) {
  return request({
    url: '/sysUser/passwordSetting',
    method: 'post',
    data
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/sysRole/getPageList/',
    method: 'post',
    data
  })
}

// 批量分配用户角色
export function addUserRoleList(data) {
  return request({
    url: '/sysUserRole/addRoles/',
    method: 'post',
    data
  })
}

// 单个用户分配用户角色
export function addRoleList(data) {
  return request({
    url: '/sysUserRole/addRole/',
    method: 'post',
    data
  })
}

// 批量修改状态
export function updateByStatus(data) {
  return request({
    url: '/sysUser/updateByStatus/',
    method: 'post',
    data
  })
}

// 根据userId查询角色集合
export function findRoles(id) {
  return request({
    url: '/sysUserRole/findUserById/' + id,
    method: 'get'
  })
}

// 根据角色id获取所有用户
export function getSysRoleAndUserList(data) {
  return request({
    url: '/sysUser/getSysRoleAndUserList/',
    method: 'post',
    data
  })
}

// 根据角色id获取所有用户的分页
export function getSysRoleAndUserPageList(data) {
  return request({
    url: '/sysUser/getSysRoleAndUserPageList/',
    method: 'post',
    data
  })
}

// 获取菜单树形结构
export function checkUserNameValid(data) {
  return request({
    url: '/sysUser/checkUserNameValid',
    method: 'post',
    data
  })
}

// 获取菜单树形结构
export function getQRCode(code) {
  return request({
    url: '/wx/getQRCode/' + code,
    method: 'get'
  })
}

