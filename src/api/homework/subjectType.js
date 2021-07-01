import request from '@/utils/request'

// 根据ID获取题型信息
export function getInfo(id) {
  return request({
    url: '/hwSubjectType/info/' + id,
    method: 'get'
  })
}

// 获取题型列表
export function getSubjectTypeList(data) {
  return request({
    url: '/hwSubjectType/getPageList',
    method: 'post',
    data
  })
}

// 创建题型
export function createSubjectType(data) {
  return request({
    url: '/hwSubjectType/add',
    method: 'post',
    data
  })
}

// 更新题型
export function updateSubjectType(data) {
  return request({
    url: '/hwSubjectType/update',
    method: 'post',
    data
  })
}

// 删除题型
export function deleteSubjectType(id) {
  return request({
    url: '/hwSubjectType/delete/' + id,
    method: 'post'
  })
}

// 删除题型题型和老师关联
export function deleteSubjectTypeAndTeacher(id) {
  return request({
    url: '/hwTeacherSubtype/delete/' + id,
    method: 'post'
  })
}

// 批量删除题型题型和老师关联
export function deleteSubjectTypeAndTeacherBatch(data) {
  return request({
    url: '/hwTeacherSubtype/delete',
    method: 'post',
    data
  })
}

// 批量删除题型
export function batchDeletes(data) {
  return request({
    url: '/hwSubjectType/delete/',
    method: 'post',
    data
  })
}

// 获取老师列表
export function getTeacherList(data) {
  return request({
    url: '/hwTeacher/getPageListByRole',
    method: 'post',
    data
  })
}

// 获取老师列表
export function getTeacherListExit(data) {
  return request({
    url: '/hwTeacher/getPageListByRoleExit',
    method: 'post',
    data
  })
}

// 获取老师列表
export function getTeacherList1(data) {
  return request({
    url: '/hwTeacher/getPageListByRole1',
    method: 'post',
    data
  })
}

// 获取老师列表
export function getListAll(data) {
  return request({
    url: '/hwTeacher/getListAll',
    method: 'post',
    data
  })
}

// 获取题型列表
export function getHwSubjectTypeList(data) {
  return request({
    url: '/hwSubjectType/getHwSubjectTypeList',
    method: 'post',
    data
  })
}

// 获取题型列表
export function getIsSubjectTypeName(data) {
  return request({
    url: '/hwSubjectType/getIsSubjectTypeName',
    method: 'post',
    data
  })
}

// 校验题型名称
export function checkSubjectNameValid(data) {
  return request({
    url: '/hwSubjectType/checkSubjectNameValid',
    method: 'post',
    data
  })
}
