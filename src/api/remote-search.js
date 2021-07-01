import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}
