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
  },
  // 获取参数列表
  getAttributesById(id, params) {
    return axios.get(`${base.dev}/categories/${id}/attributes`, {
      params: params
    })
  },
  // 添加参数
  addAttributesById(id, params) {
    return axios.post(`${base.dev}/categories/${id}/attributes`, params)
  },
  // 根据 ID 查询单个参数
  getAttributeById(id, attrId, params) {
    return axios.get(`${base.dev}/categories/${id}/attributes/${attrId}`, {
      params: params
    })
  },
  // 根据 ID编辑参数
  updateAttributeById(id, attrId, params) {
    return axios.put(
      `${base.dev}/categories/${id}/attributes/${attrId}`,
      params
    )
  },
  // 根据 ID删除参数
  removeAttributeById(id, attrId) {
    return axios.delete(`${base.dev}/categories/${id}/attributes/${attrId}`)
  }
}

export default goods
