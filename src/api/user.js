import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function changePassword(oldPass, newPass) {
  const data = {
    oldPass,
    newPass
  }
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

export function newUser(newName, username, pass, project, avatar) {
  const data = {
    newName,
    username,
    pass,
    project,
    avatar
  }
  return request({
    url: '/user/newUser',
    method: 'post',
    data
  })
}

export function addUser(username, project) {
  const data = {
    username,
    project
  }
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

export function removeUser(username, project) {
  const data = {
    username,
    project
  }
  return request({
    url: '/user/removeUser',
    method: 'delete',
    data
  })
}

export function getUsers() {
  return request({
    url: '/user/getUsers',
    method: 'get'
  })
}

export function getCurrentProjects(query) {
  return request({
    url: '/user/getCurrentProjects',
    method: 'get',
    params: query
  })
}

export function getAdminProjects() {
  return request({
    url: '/user/getAdminProjects',
    method: 'get'
  })
}

export function changeName(newName) {
  const data = {
    newName
  }
  return request({
    url: '/user/name',
    method: 'put',
    data
  })
}

export function changeSignature(data) {
  return request({
    url: '/user/signature',
    method: 'put',
    data
  })
}

export function fetchSignature() {
  return request({
    url: '/user/signature',
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'post',
    params: { token }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user',
    method: 'get',
    params: { token }
  })
}
