import request from '@/utils/request'

// 添加课程
export function addHwClassSchedule(data) {
  return request({
    url: '/hwClassSchedule/add',
    method: 'post',
    data
  })
}

export function getScheduleInfo() {
  return request({
    url: '/hwClassSchedule/getScheduleInfo',
    method: 'post'
  })
}

export function update(data) {
  return request({
    url: '/hwClassSchedule/update',
    method: 'post',
    data
  })
}

export function deleteSchedule(id) {
  return request({
    url: '/hwClassSchedule/delete/' + id,
    method: 'post'
  })
}

export function getStudentScheduleInfo() {
  return request({
    url: '/hwClassSchedule/getStudentScheduleInfo',
    method: 'post'
  })
}

export function importSchedule(data) {
  return request({
    url: '/hwClassSchedule/import',
    method: 'post',
    data
  })
}
