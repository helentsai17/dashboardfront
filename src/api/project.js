import request from '@/utils/request'

export function putProject(data) {
  return request({
    url: '/project/new',
    method: 'put',
    data,
    timeout: 30000
  })
}

export function fetchList() {
  return request({
    url: '/project/list',
    method: 'get'
  })
}
