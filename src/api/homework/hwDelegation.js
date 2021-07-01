// 批量删除标签
import request from '@/utils/request'

export function getPageList(data) {
  return request({
    url: '/hwHomeworkDelegation/getPageList/',
    method: 'post',
    data
  })
}

export function addHwHomeworkDelegation(data) {
  return request({
    url: '/hwHomeworkDelegation/add/',
    method: 'post',
    data
  })
}

export function deleteDe(id) {
  return request({
    url: '/hwHomeworkDelegation/delete/' + id,
    method: 'post'
  })
}
