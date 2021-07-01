import request from '@/utils/request'

// 获取学校
export function getSysSchoolList(data) {
  return request({
    url: '/sysSchool/getPageList',
    method: 'post',
    data
  })
}

// 创建学校
export function createSysSchool(data) {
  return request({
    url: '/sysSchool/add',
    method: 'post',
    data
  })
}

// 更新学校
export function updateSysSchool(data) {
  return request({
    url: '/sysSchool/update',
    method: 'post',
    data
  })
}

// 删除学校
export function deleteSysSchool(id) {
  return request({
    url: '/sysSchool/delete/' + id,
    method: 'post'
  })
}

// 删除学校批量
export function deleteSysSchools(data) {
  return request({
    url: '/sysSchool/delete/',
    method: 'post',
    data
  })
}

// 修改行政区域状态
export function updateStatusById(data) {
  return request({
    url: '/sysSchool/updateStatus/',
    method: 'post',
    data
  })
}

// 校验学校代码
export function checkSchoolCodeValid(data) {
  return request({
    url: '/sysSchool/checkSchoolCodeValid/',
    method: 'post',
    data
  })
}

// 校验学校代码
export function importData(data) {
  return request({
    url: '/sysSchool/import/',
    method: 'post',
    data
  })
}
