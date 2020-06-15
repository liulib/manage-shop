/**
 * operations模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例

const operations = {
  // 获取侧边栏菜单数据
  getMenuList() {
    return axios.get(`${base.dev}/menus`)
  }
}

export default operations
