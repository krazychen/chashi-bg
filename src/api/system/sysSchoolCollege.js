import request from '@/utils/request'

// 获取专业
export function getSysSchoolCollegeList(data) {
  return request({
    url: '/sysSchoolCollege/getPageList',
    method: 'post',
    data
  })
}

// 创建专业
export function createSysSchoolCollege(data) {
  return request({
    url: '/sysSchoolCollege/add',
    method: 'post',
    data
  })
}

// 更新专业
export function updateSysSchoolCollege(data) {
  return request({
    url: '/sysSchoolCollege/update',
    method: 'post',
    data
  })
}

// 删除专业
export function deleteSysSchoolCollege(id) {
  return request({
    url: '/sysSchoolCollege/delete/' + id,
    method: 'post'
  })
}

// 删除专业批量
export function deleteSysSchoolColleges(data) {
  return request({
    url: '/sysSchoolCollege/delete/',
    method: 'post',
    data
  })
}

// 修改专业状态
export function updateStatusById(data) {
  return request({
    url: '/sysSchool/updateStatus/',
    method: 'post',
    data
  })
}

// 获取考试范围
export function getSysSchoolCollegeExamscope(id) {
  return request({
    url: '/sysCollegeExamscope/infoByCollegeId/' + id,
    method: 'get'
  })
}

// 保存考试范围
export function updateSysSchoolCollegeExamscope(data) {
  return request({
    url: '/sysCollegeExamscope/update/',
    method: 'post',
    data
  })
}

// 获取考试范围
export function getCollegeExamscope() {
  return request({
    url: '/sysCollegeExamscope/infoByCollegeExam/',
    method: 'get'
  })
}

// 批量保存考试范围
export function updateSysSchoolCollegeExamscopeAll(data) {
  return request({
    url: '/sysCollegeExamscope/add/',
    method: 'post',
    data
  })
}

