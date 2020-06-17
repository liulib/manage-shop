<template>
  <div class="users-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="10">
        <!-- 搜索 -->
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="handleClear">
            <el-button slot="append" icon="el-icon-search" @click="_getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加 -->
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 用户状态改变 -->
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="handleStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 用户操作 -->
        <el-table-column label="操作" width="180px">
          <template v-slot:default="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="_showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRolesDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :page-sizes="[5, 10, 20, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="handleAddClose">
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="用户名" required prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" required prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" required prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="handleEditClose">
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="用户名" required prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" required prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRolesDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
      </div>
      <span>分配新角色:</span>
      <el-select v-model="rolesValue" placeholder="请选择">
        <el-option v-for="item in rolesData" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
      </el-select>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="setRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // 邮箱格式检测
    var checkEmail = (rule, val, callback) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(val)) {
        return callback()
      }
      callback(new Error('邮箱格式错误'))
    }
    // 手机号格式检测
    var checkPhone = (rule, val, callback) => {
      const regPhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regPhone.test(val)) {
        return callback()
      }
      callback(new Error('手机号格式错误'))
    }
    return {
      // 用户查询参数
      queryInfo: { query: '', pagenum: 1, pagesize: 5 },
      // 用户列表
      userList: [],
      // 总用户数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone }
        ]
      },
      editForm: {},
      setRolesDialogVisible: false,
      rolesData: [],
      userInfo: {},
      rolesValue: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取用户列表
    async _getUserList() {
      try {
        const res = await this.$api.users.getUserList(this.queryInfo)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
          this.$message.success(res.data.meta.msg)
          console.log(this.userList)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 修改用户状态
    async _updateUserState(uId, state) {
      try {
        const res = await this.$api.users.updateUserState(uId, state)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 添加用户
    _addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$api.users.addUser(this.addForm)
          // res.data.meta.status === 201 为成功 其他都为失败
          if (res.data.meta.status === 201) {
            this.$message.success(res.data.meta.msg)
            // 隐藏对话框
            this.addDialogVisible = false
            // 重新获取用户列表
            this._getUserList()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 处理pagesize改变
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this._getUserList()
    },
    // 处理pagenum改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this._getUserList()
    },
    // 处理状态改变
    handleStateChange(val) {
      this._updateUserState(val.id, val.mg_state)
    },
    // 搜索框清空处理
    handleClear() {
      this.queryInfo.query = ''
      this._getUserList()
    },
    // 监听添加用户对话框的关闭
    handleAddClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 显示编辑对话框并获取数据
    async _showEditDialog(userId) {
      try {
        const res = await this.$api.users.getUserById(userId)
        console.log(res.data)
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
    // 监听编辑用户对话框的关闭
    handleEditClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    _editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$api.users.updateUserById(this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.editDialogVisible = false
            this._getUserList()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 删除用户
    removeUserById(userId) {
      this.$confirm('是否删除用户?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await this.$api.users.deleteUserById(userId)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this._getUserList()
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
    // 获取角色列表
    async _getRolesList() {
      try {
        const res = await this.$api.rights.getRolesList()
        if (res.data.meta.status === 200) {
          this.rolesData = res.data.data
          console.log(this.rolesData)
          this.$message.success(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 显示分配用户角色对话框
    showRolesDialog(userInfo) {
      this.userInfo = userInfo
      this.setRolesDialogVisible = true
    },
    // 设置用户角色
    async setRoles() {
      try {
        const res = await this.$api.users.setUserRoles(this.userInfo.id, {
          rid: this.rolesValue
        })
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
        this._getUserList()
        this.setRolesDialogVisible = false
      } catch (error) {
        this.$message.error(error)
      }
    }
  },
  created() {
    this._getUserList()
    this._getRolesList()
  }
}
</script>
<style lang='less' scoped>
</style>
