import request from '@/utils/request'

// 消息配置列表
export function getHwMessageConfigPageList(data) {
  return request({
    url: '/hwMessageConfig/getPageList',
    method: 'post',
    data
  })
}

// 添加消息配置
export function addHwMessageConfig(data) {
  return request({
    url: '/hwMessageConfig/add',
    method: 'post',
    data
  })
}

// 更新消息配置
export function updateHwMessageConfig(data) {
  return request({
    url: '/hwMessageConfig/update',
    method: 'post',
    data
  })
}

// 删除消息配置
export function deleteHwMessageConfig(id) {
  return request({
    url: '/hwMessageConfig/delete/' + id,
    method: 'post'
  })
}

// 批量删除作业
export function deleteHwMessageConfigs(data) {
  return request({
    url: '/hwMessageConfig/delete/',
    method: 'post',
    data
  })
}

// 禁用启用
export function updateStatusById(data) {
  return request({
    url: '/hwMessageConfig/updateStatus/',
    method: 'post',
    data
  })
}

// 添加或修改微信模板映射
export function addWxTemplate(data) {
  return request({
    url: '/hwMessageWxTemplate/addWxTemplate/',
    method: 'post',
    data
  })
}

// 获取微信消息模板微信映射信息
export function getWxTemplate(id) {
  return request({
    url: '/hwMessageWxTemplate/getWxTemplate/' + id,
    method: 'post'
  })
}

// 添加或修改系统模板映射
export function addSysTemplate(data) {
  return request({
    url: '/hwMessageSysTemplate/addSysTemplate/',
    method: 'post',
    data
  })
}

// 获系统取消息模板微信映射信息
export function getSysTemplate(id) {
  return request({
    url: '/hwMessageSysTemplate/getSysTemplate/' + id,
    method: 'post'
  })
}

// 配置名称去重
export function configNameValid(data) {
  return request({
    url: '/hwMessageConfig/configNameValid',
    method: 'post',
    data
  })
}

