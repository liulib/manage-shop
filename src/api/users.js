/**
 * users模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例

const users = {
  // 登录 POST
  login(params) {
    return axios.post(`${base.dev}/login`, params)
  },
  // 获取用户列表
  getUserList(params) {
    return axios.get(`${base.dev}/users`, { params: params })
  },
  // 添加用户
  addUser(params) {
    return axios.post(`${base.dev}/users`, params)
  },
  // 更新用户状态
  updateUserState(uId, state) {
    return axios.put(`${base.dev}/users/${uId}/state/${state}`)
  },
  // 根据userId查询用户信息
  getUserById(uId) {
    return axios.get(`${base.dev}/users/${uId}`)
  },
  // 根据userId修改用户信息
  updateUserById(uId, params) {
    return axios.put(`${base.dev}/users/${uId}`, params)
  },
  // 根据userId删除用户信息
  deleteUserById(uId) {
    return axios.delete(`${base.dev}/users/${uId}`)
  }
}

export default users
