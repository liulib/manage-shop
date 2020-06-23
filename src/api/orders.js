/**
 * orders模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例

const orders = {
  // 获取订单数据
  getOrderList(params) {
    return axios.get(`${base.dev}/orders`, { params })
  },
  // 获取物流信息
  getLogistics() {
    return axios.get(`${base.dev}/kuaidi/1106975712662`)
  }
}

export default orders
