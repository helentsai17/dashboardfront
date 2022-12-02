import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/patient/list',
    method: 'get',
    params: query
  })
}

export function fetchCounts() {
  return request({
    url: '/patient/counts',
    method: 'get'
  })
}

export function postPatient(data) {
  return request({
    url: '/patient',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function postPatientNoForm(data) {
  return request({
    url: '/patient',
    method: 'post',
    data
  })
}

export function putPatient(data) {
  return request({
    url: '/patient',
    method: 'put',
    data
  })
}

export function putEpic(data) {
  return request({
    url: '/patient/epic',
    method: 'put',
    data
  })
}

export function putErap(data) {
  return request({
    url: '/patient/erap',
    method: 'put',
    data
  })
}

export function withdrawPatient(mrn, project) {
  return request({
    url: `/patient/withdraw/${mrn}`,
    method: 'put',
    params: { project }
  })
}

export function fetchEligibility(mrn, project) {
  return request({
    url: `/patient/mrn/${mrn}`,
    method: 'get',
    params: { project }
  })
}

export function fetchRedcapUpdate() {
  return request({
    url: '/redcap/update',
    method: 'get'
  })
}

export function fetchConsentForm(query) {
  return request({
    url: '/patient/download',
    method: 'get',
    params: query,
    responseType: 'arraybuffer'
  })
}

export function fetchConsentFormPaper(query) {
  return request({
    url: '/patient/paper',
    method: 'get',
    params: query,
    responseType: 'arraybuffer'
  })
}

export function fetchAnswers(query) {
  return request({
    url: '/patient/answers',
    method: 'get',
    params: query
  })
}

export function sendEmailInvite(data) {
  return request({
    url: '/patient/remote',
    method: 'post',
    data
  })
}
