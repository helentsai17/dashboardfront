import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/message/list',
    method: 'get',
    params: query
  })
}

export function fetchMsg(msgId) {
  return request({
    url: `/message/${msgId}`,
    method: 'get'
  })
}

export function fetchReplyList(msgId) {
  return request({
    url: `/message/reply/list/${msgId}`,
    method: 'get'
  })
}

export function putReply(data) {
  return request({
    url: '/message/reply',
    method: 'put',
    data
  })
}
