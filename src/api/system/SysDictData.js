// 字典值
import request from '@/utils/request'

// 分页获取字典值
export function getSysDictDataList(data) {
  return request({
    url: '/sysDictData/getPageList',
    method: 'post',
    data
  })
}

// 创建字典值
export function createSysDictData(data) {
  return request({
    url: '/sysDictData/add',
    method: 'post',
    data
  })
}

// 更新字典值
export function updateSysDictData(data) {
  return request({
    url: '/sysDictData/update',
    method: 'post',
    data
  })
}

// 删除字典值
export function deleteSysDictData(id) {
  return request({
    url: '/sysDictData/delete/' + id,
    method: 'post'
  })
}

// 批量删除字典值
export function deleteSysDictDatas(data) {
  return request({
    url: '/sysDictData/delete/',
    method: 'post',
    data
  })
}

// 获取精简版的菜单树形结构
export function getSysMenuSimplifyPageList(data) {
  return request({
    url: '/sysDictData/getSysDictDataSimplifyPageList',
    method: 'post',
    data
  })
}

// 修改字典数据状态
export function updateStatusDataById(data) {
  return request({
    url: '/sysDictData/updateStatus/',
    method: 'post',
    data
  })
}

// 获取缓存的字典数据表
export function getAllDictDataCache() {
  return request({
    url: '/sysDictData/getAllDictDataCache/',
    method: 'post'
  })
}

// 获取缓存的字典数据表
export function getDictDataByType(type) {
  return request({
    url: '/sysDictData/getDictDataByType/' + type,
    method: 'post'
  })
}
