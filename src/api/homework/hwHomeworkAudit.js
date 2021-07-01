import request from '@/utils/request'

// 复评接口

// 新增复评
export function add(data) {
  return request({
    url: '/hwHomeworkAudit/add',
    method: 'post',
    data
  })
}

// 更新复评
export function update(data) {
  return request({
    url: '/hwHomeworkAudit/updateRepeatById',
    method: 'post',
    data
  })
}
