import request from '@/utils/request'

// 根据ID获取用户信息
export function getInfo(id) {
  return request({
    url: '/sysOffice/info/' + id,
    method: 'get'
  })
}

// 获取用户列表
export function getOfficeList(data) {
  return request({
    url: '/sysOffice/getPageList',
    method: 'post',
    data
  })
}

// 创建用户
export function createOffice(data) {
  return request({
    url: '/sysOffice/add',
    method: 'post',
    data
  })
}

// 更新用户
export function updateOffice(data) {
  return request({
    url: '/sysOffice/update',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteOffice(officeCode) {
  return request({
    url: '/sysOffice/delete/' + officeCode,
    method: 'post'
  })
}

// 修改用户状态
export function statusUpdate(officeCode) {
  return request({
    url: '/sysOffice/updateBystatus/' + officeCode,
    method: 'post'
  })
}

// 批量删除用户
export function deleteOffices(data) {
  return request({
    url: '/sysOffice/delete/',
    method: 'post',
    data
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
