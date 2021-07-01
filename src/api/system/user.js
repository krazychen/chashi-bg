import request from '@/utils/request'
import { getLoginSysUserVo } from '@/utils/auth'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 微信登陆
export function wxlogin(data) {
  return request({
    url: '/wxlogin',
    method: 'post',
    data: data
  })
}

// 微信登陆
export function wxlogin1(data) {
  return request({
    url: '/wxlogin1',
    method: 'post',
    data: data
  })
}

export function getRoleTypes() {
  return request({
    url: '/sysUser/getRoleList',
    method: 'post'
  })
}

// 根据ID获取用户信息
export function getInfo(id) {
  return request({
    url: '/sysUser/info/' + id,
    method: 'get'
  })
}

// 根据ID获取用户信息
export function getCurrentUserInfo() {
  return request({
    url: '/sysUser/info/' + getLoginSysUserVo().id,
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

// 更新个人资料
export function update(data) {
  return request({
    /* url: '/sysUser/updateUserInformation',*/
    url: '/hwHomework/updateUserInformation',
    method: 'post',
    data
  })
}

// 更新密码
export function updatePassword(data) {
  return request({
    url: '/sysUser/updatePassword',
    method: 'post',
    data
  })
}

// 解绑微信
export function noWx(id) {
  return request({
    url: '/sysUser/noWx/' + id,
    method: 'post'
  })
}

// 批量解绑微信解绑微信
export function nowxs(data) {
  return request({
    url: '/sysUser/nowxs',
    method: 'post',
    data: data
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/sysUser/delete/' + id,
    method: 'post'
  })
}

// 公众号登录
export function checkLoginQr(code) {
  return request({
    url: '/wx/checkLoginQr/' + code,
    method: 'post'
  })
}
