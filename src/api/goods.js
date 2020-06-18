/**
 * goods模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例

const goods = {
  // 获取分类数据
  getCategories(params) {
    return axios.get(`${base.dev}/categories`, { params: params })
  },
  // 根据id获取分类数据
  getCategoriesById(id) {
    return axios.get(`${base.dev}/categories/${id}`)
  },
  // 添加分类数据
  addCategories(params) {
    return axios.post(`${base.dev}/categories`, params)
  },
  // 编辑分类数据
  updateCategories(id, params) {
    return axios.put(`${base.dev}/categories/${id}`, params)
  },
  // 删除分类数据
  deleteCategories(id, params) {
    return axios.delete(`${base.dev}/categories/${id}`, { data: params })
  }
}

export default goods
