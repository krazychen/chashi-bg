import request from '@/utils/request'

// 获取消息列表
export function getMsgList(data) {
  return request({
    url: '/sysMsg/getStudentPageList',
    method: 'post',
    data
  })
}

// 查看消息详情
export function getSysMsg(id) {
  return request({
    url: '/sysMsg/info/' + id,
    method: 'get'
  })
}

// 查询默认用户
export function findByUser() {
  return request({
    url: '/sysMsg/findByUser',
    method: 'get'
  })
}

// 根据id修改消息记录表
export function updateMsgRecord(id) {
  return request({
    url: '/sysMsgRecord/updateByRecord/' + id,
    method: 'post'
  })
}

