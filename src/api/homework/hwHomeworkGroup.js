import request from '@/utils/request'

// 新增复评
export function saveHwHomeworkGroup(data) {
  return request({
    url: '/hwHomeworkGroup/add',
    method: 'post',
    data
  })
}

// 作业组列表
export function getHwHomeworkGroupList(data) {
  return request({
    url: '/hwHomeworkGroup/getPageList',
    method: 'post',
    data
  })
}

// 删除作业组
export function deleteHwHomeworkGroup(id) {
  return request({
    url: '/hwHomeworkGroup/delete/' + id,
    method: 'post'
  })
}

// 批量删除作业组
export function deleteHwHomeworkGroups(data) {
  return request({
    url: '/hwHomeworkGroup/delete',
    method: 'post',
    data
  })
}

// 发布
export function releaseHwHomeworkGroups(id) {
  return request({
    url: '/hwHomeworkGroup/release/' + id,
    method: 'post'
  })
}

// 发布
export function noReleaseHwHomeworkGroups(id) {
  return request({
    url: '/hwHomeworkGroup/noRelease/' + id,
    method: 'post'
  })
}

// 批量删除作业组
export function updateHwHomeworkGroups(data) {
  return request({
    url: '/hwHomeworkGroup/update',
    method: 'post',
    data
  })
}

// 获取所有作业组的基础信息
export function getReissueHomeworkGroupList() {
  return request({
    url: '/hwHomeworkGroup/getReissueHomeworkGroupList',
    method: 'post'
  })
}
