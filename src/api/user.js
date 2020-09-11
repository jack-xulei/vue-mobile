import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/userlogin/login',
    method: 'post',
    data,
    loading: true
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-template/user/info',
    method: 'get',
    params: { token },
    baseURL: process.env.VUE_APP_MOCK_API
  })
}

export function logout() {
  return request({
    url: '/userlogin/loginout',
    method: 'post'
  })
}
