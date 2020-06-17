/**
 * rights模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from '@/utils/http' // 导入http中创建的axios实例

const rights = {
  // 获取权限列表
  getRightsList(type) {
    return axios.get(`${base.dev}/rights/${type}`)
  },
  // 获取角色列表
  getRolesList() {
    return axios.get(`${base.dev}/roles`)
  },
  // 添加角色
  addRoles(params) {
    return axios.post(`${base.dev}/roles`, params)
  },
  // 根据id查询角色
  getRolesById(id) {
    return axios.get(`${base.dev}/roles/${id}`)
  },
  // 编辑角色
  editRolesInfo(id, params) {
    return axios.put(`${base.dev}/roles/${id}`, params)
  },
  // 根据rolesId删除角色信息
  deleteRolesById(rolesId) {
    return axios.delete(`${base.dev}/roles/${rolesId}`)
  },
  // 删除角色指定权限
  deleteRolesByRightsId(rolesId, rightsId) {
    return axios.delete(`${base.dev}/roles/${rolesId}/rights/${rightsId}`)
  },
  // 角色授权
  updateRightsById(roleId, rights) {
    return axios.post(`${base.dev}/roles/${roleId}/rights`, { rids: rights })
  }
}

export default rights
