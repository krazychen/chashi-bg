import request from '@/utils/request'

// 新建作业监控
export function addHwHomeworkMonitor(data) {
  return request({
    url: '/hwHomeworkMonitor/add/',
    method: 'post',
    data
  })
}

// 作业监控列表
export function getHwHomeworkMonitorPageList(data) {
  return request({
    url: '/hwHomeworkMonitor/getPageList',
    method: 'post',
    data
  })
}

// 恢复监控
export function resumeJob(id) {
  return request({
    url: '/hwHomeworkMonitor/resumeJob/' + id,
    method: 'post'
  })
}

// 暂停监控
export function pauseJob(id) {
  return request({
    url: '/hwHomeworkMonitor/pauseJob/' + id,
    method: 'post'
  })
}

// 删除监控
export function deleteHwHomeworkMonitor(id) {
  return request({
    url: '/hwHomeworkMonitor/delete/' + id,
    method: 'post'
  })
}

// 获取作业标签
export function getHwHomeworkMonitorList(id) {
  return request({
    url: '/hwHomeworkMonitor/getHwHomeworkMonitorList/' + id,
    method: 'post'
  })
}

