import request from '@/utils/request'

// 获取任务列表
export function getTaskList(data) {
  return request({
    url: '/sysScheduleJob/getPageList',
    method: 'post',
    data
  })
}

// 创建任务
export function createTask(data) {
  return request({
    url: '/sysScheduleJob/add',
    method: 'post',
    data
  })
}

// 更新任务
export function updateTask(data) {
  return request({
    url: '/sysScheduleJob/update',
    method: 'post',
    data
  })
}

// 删除任务
export function deleteTask(id) {
  return request({
    url: '/sysScheduleJob/delete/' + id,
    method: 'post'
  })
}

// 暂停任务
export function pauseTask(id) {
  return request({
    url: '/sysScheduleJob/pauseJob/' + id,
    method: 'post'
  })
}

// 恢复任务
export function resumeTask(id) {
  return request({
    url: '/sysScheduleJob/resumeJob/' + id,
    method: 'post'
  })
}

// 批量暂停任务s
export function batchStopTask(ids) {
  return request({
    url: '/sysScheduleJob/batchPauseJob/' + ids,
    method: 'post'
  })
}

// 批量恢复任务
export function batchRecoveryTask(ids) {
  return request({
    url: '/sysScheduleJob/batchResumeJob/' + ids,
    method: 'post'
  })
}

// 获取任务日志列表
export function findTaskLogList(data) {
  return request({
    url: '/sysScheduleJobLog/getLogPageList',
    method: 'post',
    data
  })
}
