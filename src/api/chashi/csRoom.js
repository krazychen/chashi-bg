import request from '@/utils/request'

// 获取茶室列表
export function getRoomList(data) {
  return request({
    url: '/csTearoom/getPageObjList',
    method: 'post',
    data
  })
}

// 创建茶室图片
export function createRoomPic(data) {
  return request({
    url: '/csTearoom/addRoom',
    method: 'post',
    data
  })
}

// 创建茶室
export function createRoom(data) {
  return request({
    url: '/csTearoom/add',
    method: 'post',
    data
  })
}

// 更新茶室
export function updateRoom(data) {
  return request({
    url: '/csTearoom/updateRoom',
    method: 'post',
    data
  })
}

// 删除茶室
export function deleteRoom(id) {
  return request({
    url: '/csTearoom/delete/' + id,
    method: 'post'
  })
}

// 修改茶室状态
export function updateStatusById(data) {
  return request({
    url: '/csTearoom/updateStatus/',
    method: 'post',
    data
  })
}

// 修改茶室营业状态
export function updateReleaseStatusById(data) {
  return request({
    url: '/csTearoom/updateReleaseStatus/',
    method: 'post',
    data
  })
}

// 导出茶室列表
export function exportList(data) {
  return request({
    url: '/csTearoom/exportList',
    method: 'post',
    responseType: 'blob',
    data
  })
}
