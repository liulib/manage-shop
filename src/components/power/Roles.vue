<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="rolesData" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row
              :class="'border-bottom'"
              v-for="item in scope.row.children"
              :key="item.id"
              class="vertical-center"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row.id, item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限  三级权限-->
              <el-col :span="19">
                <el-row
                  :class="'border-bottom'"
                  v-for="item1 in item.children"
                  :key="item1.id"
                  class="vertical-center"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightsById(scope.row.id, item1.id)"
                    >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      type="warning"
                      @close="removeRightsById(scope.row.id, item2.id)"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!-- 用户操作 -->
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="_showEditDialog(scope.row.id)"
            >编辑</el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="_removeUserById(scope.row.id)"
            >删除</el-button>

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="handleAddClose">
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="角色名称" required prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="handleEditClose">
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="角色名" required prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑权限对话框 -->
    <el-dialog
      title="编辑权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="handleRightDialogClose"
    >
      <!-- 内容主体区域 -->
      <!-- 树形控件 -->
      <el-tree
        :data="rightsData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="defKeys"
        default-expand-all
        ref="rightsFormRef"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_editRolesRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rolesData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightsDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: { roleName: '', roleDesc: '' },
      addFormRules: {
        roleName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      rolesId: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取角色列表
    async _getRolesList() {
      try {
        const res = await this.$api.rights.getRolesList()
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rolesData = res.data.data
          this.$message.success(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 删除角色指定权限
    removeRightsById(rolesId, rightsId) {
      console.log(rolesId, rightsId)
      this.$confirm('是否取消权限?', '取消权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await this.$api.rights.deleteRolesByRightsId(
              rolesId,
              rightsId
            )
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this._getRolesList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.meta.msg
              })
            }
          } catch (error) {
            this.$message.error(error)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加角色
    _addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        try {
          const res = await this.$api.rights.addRoles(this.addForm)
          // res.data.meta.status === 201 为成功 其他都为失败
          if (res.data.meta.status === 201) {
            this.$message.success(res.data.meta.msg)
            // 隐藏对话框
            this.addDialogVisible = false
            // 重新获取角色列表
            this._getRolesList()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 显示编辑对话框并获取数据
    async _showEditDialog(rolesId) {
      try {
        const res = await this.$api.rights.getRolesById(rolesId)
        // 200为成功
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.editForm = res.data.data
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
      this.editDialogVisible = true
    },
    // 编辑角色
    _editRolesInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        try {
          const res = await this.$api.rights.editRolesInfo(
            this.editForm.roleId,
            {
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            }
          )
          // res.data.meta.status === 200 为成功 其他都为失败
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // 隐藏对话框
            this.editDialogVisible = false
            // 重新获取角色列表
            this._getRolesList()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 监听添加用户对话框的关闭
    handleAddClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听编辑用户对话框的关闭
    handleEditClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听编辑权限对话框的关闭
    handleRightDialogClose() {
      this.defKeys = []
    },
    // 删除角色
    _removeUserById(rolesId) {
      this.$confirm('是否删除角色?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await this.$api.rights.deleteRolesById(rolesId)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this._getRolesList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.meta.msg
              })
            }
          } catch (error) {
            this.$message.error(error)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 展示编辑权限对话框
    showRightDialog(node) {
      this.rolesId = node.id
      this.getLeafData(node, this.defKeys)
      this._getRightsList()
      this.setRightsDialogVisible = true
    },
    // 获取权限列表
    async _getRightsList() {
      try {
        const res = await this.$api.rights.getRightsList('tree')
        if (res.data.meta.status === 200) {
          this.rightsData = res.data.data
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 编辑用户权限
    async _editRolesRights() {
      // 获取所有选中与半选中的keys
      const rightsKeys = [
        ...this.$refs.rightsFormRef.getCheckedKeys(),
        ...this.$refs.rightsFormRef.getHalfCheckedKeys()
      ]
      const rightsStr = rightsKeys.join(',')
      try {
        const res = await this.$api.rights.updateRightsById(
          this.rolesId,
          rightsStr
        )
        // 判断是否成功
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {}
    },
    // 遍历对象,获取所有三级节点
    getLeafData(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafData(item, arr)
      })
    }
  },
  created() {
    this._getRolesList()
  }
}
</script>
<style lang='less' scoped>
.vertical-center {
  display: flex;
  align-items: center;
}
</style>
