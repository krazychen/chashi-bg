import request from '@/utils/request'

// 根据ID获取课程信息
export function getInfo(id) {
  return request({
    url: '/hwCourseCategory/info/' + id,
    method: 'get'
  })
}

// 获取课程列表
export function getCourseCategoryList(data) {
  return request({
    url: '/hwCourseCategory/getPageList',
    method: 'post',
    data
  })
}

// 创建课程
export function createCourseCategory(data) {
  return request({
    url: '/hwCourseCategory/add',
    method: 'post',
    data
  })
}

// 更新课程
export function updateCourseCategory(data) {
  return request({
    url: '/hwCourseCategory/update',
    method: 'post',
    data
  })
}

// 删除课程
export function deleteCourseCategory(id) {
  return request({
    url: '/hwCourseCategory/delete/' + id,
    method: 'post'
  })
}

// 修改课程状态
export function statusUpdate(id) {
  return request({
    url: '/hwCourseCategory/updateByState/' + id,
    method: 'post'
  })
}

// 批量删除课程
export function batchDeletes(data) {
  return request({
    url: '/hwCourseCategory/delete/',
    method: 'post',
    data
  })
}
