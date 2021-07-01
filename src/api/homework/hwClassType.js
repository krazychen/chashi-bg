import request from '@/utils/request'

// 标签列表
export function getHwClassTypeList(data) {
  return request({
    url: '/hwClassType/getPageList',
    method: 'post',
    data
  })
}

export function getPageListByClassType(data) {
  return request({
    url: '/hwClass/getPageListByClassType',
    method: 'post',
    data
  })
}

// 创建标签
export function createHwClassType(data) {
  return request({
    url: '/hwClassType/add',
    method: 'post',
    data
  })
}

// 更新标签
export function updateHwClassType(data) {
  return request({
    url: '/hwClassType/update',
    method: 'post',
    data
  })
}

// 删除标签
export function deleteHwClassType(id) {
  return request({
    url: '/hwClassType/delete/' + id,
    method: 'post'
  })
}

// 批量删除标签
export function deleteHwClassTypes(data) {
  return request({
    url: '/hwClassType/delete/',
    method: 'post',
    data
  })
}

// 修改字典类型状态
export function updateStatusById(data) {
  return request({
    url: '/hwClassType/updateStatus/',
    method: 'post',
    data
  })
}

// 获取所有的标签
export function getHwClassTypeAll() {
  return request({
    url: '/hwClassType/getHwClassTypeAll',
    method: 'post'
  })
}

// 获取所有标签和标签下的所有班级
export function getClassAndClassTypeList() {
  return request({
    url: '/hwClassType/getClassAndClassTypeList',
    method: 'post'
  })
}

// 获取所有标签和标签下的所有班级
export function getHwHomeworkClassRefListByHomeworkId(id) {
  return request({
    url: '/hwHomeworkClassRef/getHwHomeworkClassRefListByHomeworkId/' + id,
    method: 'post'
  })
}

// 获取所有标签和标签下的所有班级根据作业组
export function getGroupHwHomeworkClassRefListByHomeworkId(id) {
  return request({
    url: '/hwHomeworkClassRef/getGroupHwHomeworkClassRefListByHomeworkId/' + id,
    method: 'post'
  })
}

// 删除标签
export function getHwClassTypeByHomeworkId(id) {
  return request({
    url: '/hwClassType/getHwClassTypeByHomeworkId/' + id,
    method: 'post'
  })
}

export function getHwClassTypeRelatedByHomeworkId(id) {
  return request({
    url: '/hwClassType/getHwClassTypeRelatedByHomeworkId/' + id,
    method: 'post'
  })
}
