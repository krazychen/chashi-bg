import request from '@/utils/request'
import { getLoginSysUserVo } from '@/utils/auth'

// 根据ID获取学员信息
export function getInfo(id) {
  return request({
    url: '/hwStudent/info/' + id,
    method: 'get'
  })
}

// 根据ID获取学员信息
export function getCurrentStudentInfo() {
  return request({
    url: '/hwStudent/info/' + getLoginSysUserVo().id,
    method: 'get'
  })
}

// 获取学员列表
export function getStudentList(data) {
  return request({
    url: '/hwStudent/getPageList',
    method: 'post',
    data
  })
}

// 创建学员
export function createStudent(data) {
  return request({
    url: '/hwStudent/add',
    method: 'post',
    data
  })
}

// 注册学员
export function regStudent(data) {
  return request({
    url: '/hwStudent/registerHwStudent',
    method: 'post',
    data
  })
}

// 更新学员
export function updateStudent(data) {
  return request({
    url: '/hwStudent/update',
    method: 'post',
    data
  })
}

// 删除学员
export function deleteStudent(id) {
  return request({
    url: '/hwStudent/delete/' + id,
    method: 'post'
  })
}

// 修改学员状态
export function stateUpdate(id) {
  return request({
    url: '/hwStudent/updateByState/' + id,
    method: 'post'
  })
}

// 批量修改学员状态
export function updateByStatus(data) {
  return request({
    url: '/hwStudent/updateByStatus/',
    method: 'post',
    data
  })
}

// 批量删除学员
export function deleteStudents(data) {
  return request({
    url: '/hwStudent/delete/',
    method: 'post',
    data
  })
}

// 重置学员密码
export function updatePassWord(id) {
  return request({
    url: '/sysUser/uPassWord/' + id,
    method: 'post'
  })
}

// 导入学员
export function importStudent(data) {
  return request({
    url: '/hwStudent/uploadExcel/',
    method: 'post',
    data
  })
}

// 批量绑定
export function bindingExcel(data) {
  return request({
    url: '/hwStudent/bindingExcel/',
    method: 'post',
    data
  })
}


// 查询学校集合
export function getSchoolList() {
  return request({
    url: '/sysSchool/getSchoolList',
    method: 'post'
  })
}

// 查询学校集合
export function getSchoolListByCode(data) {
  return request({
    url: '/sysSchool/getSchoolListByCode',
    method: 'post',
    data
  })
}

// 根据学校查询专业集合
export function getSchooCollegelList(id) {
  return request({
    url: '/sysSchoolCollege/getSchooCollegelList/' + id,
    method: 'post'
  })
}

// 获取老师列表
export function getHwTeacherPageListOpens(data) {
  return request({
    url: '/hwStudent/getHwTeacherPageListOpen',
    method: 'post',
    data
  })
}

// 导入老师模板下载
export function downloadTemplate() {
  return request({
    url: '/hwStudent/downloadTemplate/',
    method: 'get'
  })
}

// 根据学校查询专业集合
export function getIsExis(data) {
  return request({
    url: '/hwStudentClass/getIsExis',
    method: 'post',
    data: data
  })
}

// 批量修改学员状态
export function hwStudentTypePageList(data) {
  return request({
    url: '/hwStudent/hwStudentTypePageList',
    method: 'post',
    data
  })
}

export function hwStudentTypeRelatedPageList(data) {
  return request({
    url: '/hwStudent/hwStudentTypeRelatedPageList',
    method: 'post',
    data
  })
}

// 根据学员id查找所属班级
export function getClassListByStudentId(data) {
  return request({
    url: '/hwStudent/getClassListByStudentId',
    method: 'post',
    data
  })
}

// 根据学生id保存班级关系
export function saveStudentClassByStudentId(data) {
  return request({
    url: '/hwStudent/saveStudentClassByStudentId',
    method: 'post',
    data
  })
}

// 导出
export function exportStudentList(data) {
  return request({
    url: '/hwStudent/exportStudentList',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 绑定cctalk账号
export function bindCctalk(data) {
  return request({
    url: '/hwStudent/bindCctalk',
    method: 'post',
    data
  })
}
