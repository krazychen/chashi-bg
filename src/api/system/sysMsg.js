import request from '@/utils/request'

// 根据ID获取消息信息
export function getInfo(id) {
  return request({
    url: '/sysMsg/info/' + id,
    method: 'get'
  })
}

// 用户未读消息数目
// TODO: change the api url
export function getUnreadedMsgCount() {
  return request({
    url: '/sysMsg/findMsgRecordCount',
    method: 'post'
  })
}

// 获取消息列表
export function getSysMsgList(data) {
  return request({
    url: '/sysMsg/getPageList',
    method: 'post',
    data
  })
}

// 创建消息
export function createSysMsg(data) {
  return request({
    url: '/sysMsg/add',
    method: 'post',
    data
  })
}

// 更新消息
export function updateSysMsg(data) {
  return request({
    url: '/sysMsg/update',
    method: 'post',
    data
  })
}

// 删除消息
export function deleteSysMsg(id) {
  return request({
    url: '/sysMsg/delete/' + id,
    method: 'post'
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

// 获取菜单树形结构
export function getParentCodeTrees(data) {
  return request({
    url: '/sysOffice/getParentCodeTree',
    method: 'post',
    data
  })
}

// 发布消息
export function publishMsg(id) {
  return request({
    url: '/sysMsg/publishMsg/' + id,
    method: 'post'
  })
}

// 查询默认用户
export function findByUser() {
  return request({
    url: '/sysMsg/findByUser',
    method: 'get'
  })
}

// 获取消息记录表列表
export function findMsgNotes(data) {
  return request({
    url: '/sysMsgRecord/getPageList',
    method: 'post',
    data
  })
}

// 撤销消息
export function cancelMsg(id) {
  return request({
    url: '/sysMsg/cancelMsg/' + id,
    method: 'post'
  })
}

// 根据机构id查询用户集合
export function findUserByOfficeCode(id) {
  return request({
    url: '/sysUser/findUserListByOfficeCode/' + id,
    method: 'post'
  })
}

// 根据用户ids查询用户集合
export function findUsersByIds(ids) {
  return request({
    url: '/sysUser/findUserListByIds/' + ids,
    method: 'post'
  })
}

// 下发通知
export function sendMsg(data) {
  return request({
    url: '/sysMsg/sendMsg',
    method: 'post',
    data
  })
}

export function getSysMsgDetails(id) {
  return request({
    url: '/sysMsgs/getSysMsgDetails/' + id,
    method: 'post'
  })
}

export function getListByConfigMilestone(id) {
  return request({
    url: '/hwMessageConfig/getListByConfigMilestone/' + id,
    method: 'post'
  })
}
