<template>
  <div class="categories-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格内容区域 -->
      <tree-table
        class="treeTable"
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 状态 -->
        <template v-slot:status="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opations="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="_showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="_removeCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="handleAddCateClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="分类名称" required prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" required>
          <!-- 分类数据的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="分类名称" required prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      total: 0,
      // 分类数据
      categoriesList: [],
      // 表格配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'status'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opations'
        }
      ],
      addCateDialogVisible: false,
      // cat_pid分类父 ID
      // cat_name分类名称
      // cat_level分类层级
      addCateForm: { cat_pid: 0, cat_name: '', cat_level: 0 },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      selectedKeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editCateForm: {},
      editCateDialogVisible: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取分类数据
    async _getCategories() {
      try {
        const res = await this.$api.goods.getCategories(this.queryInfo)
        // 200为成功
        if (res.data.meta.status === 200) {
          // 将返回的数据保存到data中
          this.categoriesList = res.data.data.result
          this.total = res.data.data.total
          // 显示msg
          this.$message.success(res.data.meta.msg)
          console.log(this.categoriesList)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 获取父级分类数据
    async _getParentCate() {
      try {
        const res = await this.$api.goods.getCategories({ type: 2 })
        // 200为成功
        if (res.data.meta.status === 200) {
          // 将返回的数据保存到data中
          this.parentCateList = res.data.data
          // 显示msg
          this.$message.success(res.data.meta.msg)
          console.log(this.categoriesList)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 处理pagesize改变
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this._getCategories()
    },
    // 处理pagenum改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this._getCategories()
    },
    // 监听关闭事件，重置表单
    handleAddCateClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.cat_pid = 0
      this.cat_level = 0
    },
    // 显示添加分类对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this._getParentCate()
      console.log(this.parentCateList)
    },
    // 添加分类
    _addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$api.goods.addCategories(this.addCateForm)
          // 201为成功
          if (res.data.meta.status === 201) {
            // 刷新分类数据
            this._getCategories()
            // 隐藏对话框
            this.addCateDialogVisible = false
            // 显示msg
            this.$message.success(res.data.meta.msg)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 判断选中的数据
    parentCateChange() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 取最后一项的值作为父Id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 数组长度就为level
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 编辑分类
    _editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$api.goods.updateCategories(
            this.editCateForm.cat_id,
            { cat_name: this.editCateForm.cat_name }
          )
          // res.data.meta.status === 200 为成功 其他都为失败
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // 隐藏对话框
            this.editCateDialogVisible = false
            // 重新获取角色列表
            this._getCategories()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 显示编辑对话框并获取数据
    async _showEditDialog(cateId) {
      try {
        const res = await this.$api.goods.getCategoriesById(cateId)
        // 200为成功
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.editCateForm = res.data.data
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
      this.editCateDialogVisible = true
    },
    // 删除分类
    _removeCateById(cateId) {
      this.$confirm('是否删除分类?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await this.$api.goods.deleteCategories(cateId)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this._getCategories()
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
    }
  },
  created() {
    this._getCategories()
  }
}
</script>
<style lang='less' scoped>
.el-cascader {
  width: 100%;
}

.treeTable {
  margin: 15px 0;
}
</style>
