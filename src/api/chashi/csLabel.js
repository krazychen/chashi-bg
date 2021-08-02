// 标签管理
import request from '@/utils/request'

// 分页获取标签
export function getCsLabelList(data) {
  return request({
    url: '/csLabel/getPageList',
    method: 'post',
    data
  })
}

// 创建标签
export function createCsLabel(data) {
  return request({
    url: '/csLabel/add',
    method: 'post',
    data
  })
}

// 更新标签
export function updateCsLabel(data) {
  return request({
    url: '/csLabel/update',
    method: 'post',
    data
  })
}

// 删除标签
export function deleteCsLabel(id) {
  return request({
    url: '/csLabel/delete/' + id,
    method: 'post'
  })
}

// 批量删除标签
export function deleteCsLabels(data) {
  return request({
    url: '/csLabel/delete/',
    method: 'post',
    data
  })
}

// 修改标签类型状态
export function updateStatusById(data) {
  return request({
    url: '/csLabel/updateStatus/',
    method: 'post',
    data
  })
}
