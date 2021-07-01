import request from '@/utils/request'

// 列表
export function getHwClassList(data) {
  return request({
    url: '/hwClass/getPageList',
    method: 'post',
    data
  })
}

// 创建班级
export function createHwClass(data) {
  return request({
    url: '/hwClass/add',
    method: 'post',
    data
  })
}

// 更新班级
export function updateHwClass(data) {
  return request({
    url: '/hwClass/update',
    method: 'post',
    data
  })
}

// 删除班级
export function deleteHwClass(id) {
  return request({
    url: '/hwClass/delete/' + id,
    method: 'post'
  })
}

// 删除班级学员关联
export function deleteHwClassAndStudent(id) {
  return request({
    url: '/hwStudentClass/delete/' + id,
    method: 'post'
  })
}

// 批量删除班级学员关联
export function deleteHwClassAndStudentList(data) {
  return request({
    url: '/hwStudentClass/delete',
    method: 'post',
    data
  })
}

// 批量删除班级老师关联
export function deleteHwClassAndTeacherList(data) {
  return request({
    url: '/hwTeacherClass/delete/',
    method: 'post',
    data
  })
}

// 删除班级老师关联
export function deleteHwClassAndTeacher(id) {
  return request({
    url: '/hwTeacherClass/delete/' + id,
    method: 'post'
  })
}

// 批量删除班级
export function deleteHwClasss(data) {
  return request({
    url: '/hwClass/delete/',
    method: 'post',
    data
  })
}

// 校验班级名称
export function checkClassName(data) {
  return request({
    url: '/hwClass/checkClassName/',
    method: 'post',
    data
  })
}

// 修改班级状态
export function updateStatusById(data) {
  return request({
    url: '/hwClass/updateStatus/',
    method: 'post',
    data
  })
}

export function getRoleIds(data) {
  return request({
    url: '/hwClass/getRoleIds/',
    method: 'post',
    data
  })
}

export function getAllClass() {
  return request({
    url: '/hwClass/getAllClass/',
    method: 'get'
  })
}

export function getHwDelegationClass() {
  return request({
    url: '/hwClass/getHwDelegationClass/',
    method: 'get'
  })
}

// 班级数据
export function getHwClassCctalkPageList(data) {
  return request({
    url: '/hwClass/getHwClassCctalkPageList/',
    method: 'post',
    data
  })
}

// 班级学员数据
export function getHwClassCctalkStudentPageList(data) {
  return request({
    url: '/hwClass/getHwClassCctalkStudentPageList/',
    method: 'post',
    data
  })
}

export function getTeacherClass() {
  return request({
    url: '/hwClass/getTeacherClass/',
    method: 'get'
  })
}

