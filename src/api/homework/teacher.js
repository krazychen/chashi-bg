import request from '@/utils/request'

// 根据ID获取老师信息
export function getInfo(id) {
  return request({
    url: '/hwTeacher/info/' + id,
    method: 'get'
  })
}

// 获取老师列表
export function getTeacherList(data) {
  return request({
    url: '/hwTeacher/getPageList',
    method: 'post',
    data
  })
}

// 创建老师
export function createTeacher(data) {
  return request({
    url: '/hwTeacher/add',
    method: 'post',
    data
  })
}

// 更新老师
export function updateTeacher(data) {
  return request({
    url: '/hwTeacher/update',
    method: 'post',
    data
  })
}

// 删除老师
export function deleteTeacher(id) {
  return request({
    url: '/hwTeacher/delete/' + id,
    method: 'post'
  })
}

// 删除老师
export function getOneTeacherList() {
  return request({
    url: '/hwTeacher/getOneTeacherList/',
    method: 'get'
  })
}

// 修改老师状态
export function stateUpdate(id) {
  return request({
    url: '/hwTeacher/updateByState/' + id,
    method: 'post'
  })
}

// 批量修改老师状态
export function updateByStatus(data) {
  return request({
    url: '/hwTeacher/updateByStatus/',
    method: 'post',
    data
  })
}

// 批量删除老师
export function deleteTeachers(data) {
  return request({
    url: '/hwTeacher/delete/',
    method: 'post',
    data
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/sysRole/getPageList/',
    method: 'post',
    data
  })
}

// 根据userId查询角色集合
export function findRoles(id) {
  return request({
    url: '/sysUserRole/findUserById/' + id,
    method: 'get'
  })
}

// 单个用户分配用户角色
export function addRoleList(data) {
  return request({
    url: '/sysUserRole/addRole/',
    method: 'post',
    data
  })
}

// 导入老师
export function importTeacher(data) {
  return request({
    url: '/hwTeacher/uploadExcel/',
    method: 'post',
    data
  })
}

// 获取老师列表
export function getHwTeacherPageListOpen(data) {
  return request({
    url: '/hwTeacher/getHwTeacherPageListOpen',
    method: 'post',
    data
  })
}

// 获取老师列表
export function getHwClassCheckBox(data) {
  return request({
    url: '/hwTeacher/getHwClassCheckBox',
    method: 'post',
    data
  })
}

// 获取一级老师和二级老师的分组
export function getListEntrust(data) {
  return request({
    url: '/hwTeacher/getListEntrust',
    method: 'post',
    data
  })
}

// 根据老师id及角色id查找所属题型
export function getSubjectListByTeacherIdAndRoleId(data) {
  return request({
    url: '/hwTeacher/getSubjectListByTeacherIdAndRoleId',
    method: 'post',
    data
  })
}

// 根据老师id及角色id查找未分配题型
export function getNotExistSubjectListByTeacherIdAndRoleId(data) {
  return request({
    url: '/hwTeacher/getNotExistSubjectListByTeacherIdAndRoleId',
    method: 'post',
    data
  })
}

// 根据userId查询角色集合
export function getUserRoleByUserId(id) {
  return request({
    url: '/sysUserRole/getUserRoleByUserId/' + id,
    method: 'get'
  })
}

// 老师个人中心数据
export function getHwTeacherInfo() {
  return request({
    url: '/hwTeacher/getHwTeacherInfo',
    method: 'get'
  })
}

// 根据老师id及角色id保存题型关系
export function saveTeacherSubjectTypeByTeacherId(data) {
  return request({
    url: '/hwTeacher/saveTeacherSubjectTypeByTeacherId',
    method: 'post',
    data
  })
}

// 根据老师id及角色id查找所属班级
export function getClassListByTeacherIdAndRoleId(data) {
  return request({
    url: '/hwTeacher/getClassListByTeacherIdAndRoleId',
    method: 'post',
    data
  })
}

// 根据老师id及角色id查找未分配班级
export function getNotExistClassListByTeacherIdAndRoleId(data) {
  return request({
    url: '/hwTeacher/getNotExistClassListByTeacherIdAndRoleId',
    method: 'post',
    data
  })
}

// 根据老师id及角色id保存班级关系
export function saveTeacherClassByTeacherId(data) {
  return request({
    url: '/hwTeacher/saveTeacherClassByTeacherId',
    method: 'post',
    data
  })
}

// 导出
export function exportTeacherList(data) {
  return request({
    url: '/hwTeacher/exportTeacherList',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 更新老师数据
export function updateHwTeacherInfo(data) {
  return request({
    url: '/hwTeacher/updateHwTeacherInfo',
    method: 'post',
    data: data
  })
}

// 批量添加工号
export function addJobNumbers(data) {
  return request({
    url: '/hwTeacher/addJobNumbers',
    method: 'post',
    data: data
  })
}

// 单个添加工号
export function addJobNumber(id) {
  return request({
    url: '/hwTeacher/addJobNumber/' + id,
    method: 'post'
  })
}
