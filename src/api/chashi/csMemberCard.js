import request from '@/utils/request'

// 获取会员卡列表
export function getMemberCardList(data) {
  return request({
    url: '/csMemberCard/getPageList',
    method: 'post',
    data
  })
}

// 创建会员卡
export function createMemberCard(data) {
  return request({
    url: '/csMemberCard/add',
    method: 'post',
    data
  })
}

// 更新会员卡
export function updateMemberCard(data) {
  return request({
    url: '/csMemberCard/update',
    method: 'post',
    data
  })
}

// 删除会员卡
export function deleteMemberCard(id) {
  return request({
    url: '/csAdvertise/delete/' + id,
    method: 'post'
  })
}

// 修改会员卡状态
export function updateStatusById(data) {
  return request({
    url: '/csMemberCard/updateStatus/',
    method: 'post',
    data
  })
}

