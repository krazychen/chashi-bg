// 字典
import request from '@/utils/request'

// 分页获取字典
export function getSysDictTypeList(data) {
  return request({
    url: '/sysDictType/getPageList',
    method: 'post',
    data
  })
}

// 创建字典
export function createSysDictType(data) {
  return request({
    url: '/sysDictType/add',
    method: 'post',
    data
  })
}

// 更新字典
export function updateSysDictType(data) {
  return request({
    url: '/sysDictType/update',
    method: 'post',
    data
  })
}

// 删除字典
export function deleteSysDictType(id) {
  return request({
    url: '/sysDictType/delete/' + id,
    method: 'post'
  })
}

// 批量删除字典
export function deleteSysDictTypes(data) {
  return request({
    url: '/sysDictType/delete/',
    method: 'post',
    data
  })
}

// 修改字典类型状态
export function updateStatusById(data) {
  return request({
    url: '/sysDictType/updateStatus/',
    method: 'post',
    data
  })
}
