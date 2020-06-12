/**
 * users模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例

const users = {
  // 登录 POST
  login(params) {
    return axios.post(`${base.dev}/login`, params)
  }
}

export default users
