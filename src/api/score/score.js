import request from '@/utils/request'

// 学员列表
export function getScoreStudentList(data) {
  return request({
    url: '/scoreStu/getPageList',
    method: 'post',
    data
  })
}

// 查询初始化数据
export function getStudentSelect() {
  return request({
    url: '/scoreStu/getStudentSelect',
    method: 'post'
  })
}

// 导出数据
export function exports() {
  return request({
    url: '/scoreStu/export',
    method: 'get'
  })
}

// 查看
export function getStudentRankSee(data) {
  return request({
    url: '/scoreStu/getStudentRankSee/',
    method: 'post',
    data: data
  })
}

// 获取统计图数据
export function getStatistics(data) {
  return request({
    url: '/scoreStu/getStatistics/',
    method: 'post',
    data
  })
}

// 根据学校和专业统计报考人数分页列表
export function getSchoolAndCollegeStuPageList(data) {
  return request({
    url: '/scoreStu/getSchoolAndCollegeStuPageList',
    method: 'post',
    data
  })
}

// 获取所有的标签
export function getScoreStudentAll() {
  return request({
    url: '/scoreStudent/getScoreStudentAll',
    method: 'post'
  })
}

// 获取所有标签和标签下的所有班级
export function getStudentDetailsPageList(data) {
  return request({
    url: '/scoreStu/getStudentDetailsPageList',
    method: 'post',
    data
  })
}
