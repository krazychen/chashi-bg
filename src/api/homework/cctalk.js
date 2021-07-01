import request from '@/utils/request'

// 获取课程列表
export function getPageList(data) {
  return request({
    url: '/cctalkSalseOrder/getPageList',
    method: 'post',
    data
  })
}

// 获系统对接最后一次的更新时间
export function getLatelyUpdateTime() {
  return request({
    url: '/cctalkSalseOrder/getLatelyUpdateTime',
    method: 'post'
  })
}

// 根据学籍号获取用户信息
export function getUserStudentNumber(id) {
  return request({
    url: '/cctalkSalseOrder/getUserStudentNumber/' + id,
    method: 'post'
  })
}

// 新增订单登记
export function addCctalkSalesOrderReg(data) {
  return request({
    url: '/cctalkSalesOrderReg/add/',
    method: 'post',
    data
  })
}

// 根据学籍号获取用户信息
export function addCctalkSalesOrderRegCode(data) {
  return request({
    url: '/cctalkSalesOrderReg/addCode/',
    method: 'post',
    data
  })
}

// 获取课程列表
export function getPageRegList(data) {
  return request({
    url: '/cctalkSalesOrderReg/getPageList',
    method: 'post',
    data
  })
}

export function getCandidateList(data) {
  return request({
    url: '/cctalkSalseOrder/getCandidateList',
    method: 'post',
    data
  })
}

export function addCctalkSalesOrderRef(data) {
  return request({
    url: '/cctalkSalesOrderRef/add',
    method: 'post',
    data
  })
}
export function getCctalkSalesOrderRefPageList(data) {
  return request({
    url: '/cctalkSalesOrderRef/getPageList',
    method: 'post',
    data
  })
}

export function checkExistence(data) {
  return request({
    url: '/cctalkSalesOrderRef/checkExistence',
    method: 'post',
    data
  })
}

export function checkExistenceReg(data) {
  return request({
    url: '/cctalkSalesOrderReg/checkExistence',
    method: 'post',
    data
  })
}

export function getRefUsers() {
  return request({
    url: '/cctalkSalseOrder/getRefUsers',
    method: 'post'
  })
}

/**
 * 获取租户配置列表
 * @returns {AxiosPromise}
 */
export function getCctalkCropPageList(data) {
  return request({
    url: '/cctalkSalesOrderCorp/getPageList',
    method: 'post',
    data
  })
}

/**
 * 添加租户配置
 * @returns {AxiosPromise}
 */
export function addCctalkCrop(data) {
  return request({
    url: '/cctalkSalesOrderCorp/add',
    method: 'post',
    data
  })
}

/**
 * 更新租户配置
 * @returns {AxiosPromise}
 */
export function updateCctalkCrop(data) {
  return request({
    url: '/cctalkSalesOrderCorp/update',
    method: 'post',
    data
  })
}

/**
 * 更新租户配置
 * @returns {AxiosPromise}
 */
export function deleteCctalkCrop(id) {
  return request({
    url: '/cctalkSalesOrderCorp/delete/' + id,
    method: 'post'
  })
}

export function getPageUserList(data) {
  return request({
    url: '/cctalkSellerGroupMembers/getPageUserList',
    method: 'post',
    data
  })
}

/**
 * 根据学员id获取学员对应的课程
 * @param id
 * @returns {AxiosPromise}
 */
export function getAllStudentGroup(id) {
  return request({
    url: '/cctalkSellerGroups/getAllStudentGroup/' + id,
    method: 'post'
  })
}

export function getVideoPageList(data) {
  return request({
    url: '/cctalkSellerUserVideos/getPageList',
    method: 'post',
    data
  })
}

