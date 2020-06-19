<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 选择商品 -->
      <el-row class="cascader-margin">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 商品分类的级联选择框 -->
          <el-cascader
            :options="categoriesList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChange"
            show-all-levels
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button type="primary" :disabled="isBtnDisable" @click="_showAddDialog">添加动态参数</el-button>
          <!-- 动态参数表格 -->
          <el-table type="expand" :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环渲染标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleTagClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加按钮与输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="_showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="_removeParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性按钮 -->
          <el-button type="primary" :disabled="isBtnDisable" @click="_showAddDialog">添加静态属性</el-button>
          <!-- 静态属性表格 -->
          <el-table type="expand" :data="onlyTableData">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环渲染标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleTagClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加按钮与输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="_showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="_removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="'添加'+dialogText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="dialogText" required prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性对话框 -->
    <el-dialog :title="'修改'+dialogText" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="dialogText" required prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="_editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      //   分类数据
      categoriesList: [],
      //   级联选择器规则
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   级联选择器选中的数据
      selectedKeys: [],
      //   默认激活tab页
      activeName: 'many',
      //   动态参数数据
      manyTableData: [],
      //   静态参数数据
      onlyTableData: [],
      //   tab的值，也就是动静态参数
      tabValue: 'many',
      addDialogVisible: false,
      addForm: { attr_name: '' },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {}
    }
  },
  computed: {
    //  控制添加按钮是否启用 长度不等于3则未选中
    isBtnDisable() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 控制添加对话框标题
    dialogText() {
      if (this.activeName === 'only') {
        return '静态属性'
      }
      return '动态参数'
    }
  },
  watch: {},
  methods: {
    // 获取所有分类数据
    async _getCategories() {
      try {
        const res = await this.$api.goods.getCategories()
        // 200为成功
        if (res.data.meta.status === 200) {
          // 将返回的数据保存到data中
          this.categoriesList = res.data.data
          // 显示msg
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 级联选择器的change事件处理
    parentCateChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        this._getAttributesById()
      }
    },
    // 处理切换tab页
    handleTabClick(val) {
      // 未选中的时候则不进行数据请求
      if (this.isBtnDisable) {
        return
      }
      this.tabValue = val.name
      this._getAttributesById()
    },
    // 根据ID获取属性
    async _getAttributesById() {
      try {
        const res = await this.$api.goods.getAttributesById(
          this.selectedKeys[this.selectedKeys.length - 1],
          { sel: this.tabValue }
        )
        // 200为成功
        if (res.data.meta.status === 200) {
          res.data.data.forEach(item => {
            // 处理attr_vals
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 添加各自的inputVisible inputValue
            item.inputVisible = false
            item.inputValue = ''
          })
          // 将返回的数据保存到data中
          if (this.tabValue === 'many') {
            this.manyTableData = res.data.data
          } else {
            this.onlyTableData = res.data.data
          }
          // 显示msg
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 显示添加对话框
    _showAddDialog() {
      this.addDialogVisible = true
    },
    // 监听添加对话框关闭
    handleAddClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新的属性
    _addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$api.goods.addAttributesById(
            this.selectedKeys[this.selectedKeys.length - 1],
            { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
          )
          // 201为成功
          if (res.data.meta.status === 201) {
            // 将返回的数据保存到data中
            // 显示msg
            this.$message.success(res.data.meta.msg)
            // 刷新属性列表
            this._getAttributesById()
            // 隐藏对话框
            this.addDialogVisible = false
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 显示编辑对话框并获取数据
    async _showEditDialog(value) {
      try {
        const res = await this.$api.goods.getAttributeById(
          value.cat_id,
          value.attr_id,
          { attr_sel: this.activeName }
        )
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
    // 修改属性
    _editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          const res = await this.$api.goods.updateAttributeById(
            this.editForm.cat_id,
            this.editForm.attr_id,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          )
          // res.data.meta.status === 200 为成功 其他都为失败
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // 隐藏对话框
            this.editDialogVisible = false
            // 重新获取参数列表
            this._getAttributesById()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error(error)
        }
      })
    },
    // 删除属性
    _removeParams(value) {
      this.$confirm('是否删除参数?', '删除参数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await this.$api.goods.removeAttributeById(
              value.cat_id,
              value.attr_id
            )
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 重新获取参数列表
              this._getAttributesById()
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
    // 处理input失去焦点或者按下enter
    handleInputConfirm(value) {
      console.log(value.attr_sel)
      // 为空则说明未输入数据直接重置
      if (value.inputValue.trim().length === 0) {
        value.inputVisible = false
        value.inputValue = ''
        return
      }
      // 没有return则是输入了数据 接着发起请求
      value.attr_vals.push(value.inputValue.trim())
      value.inputVisible = false
      value.inputValue = ''
      this._saveAttrChange(value)
    },
    // 显示输入框
    showInput(value) {
      value.inputVisible = true
      //   自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 发请求保存attr_vals
    async _saveAttrChange(value) {
      try {
        const res = await this.$api.goods.updateAttributeById(
          this.selectedKeys[this.selectedKeys.length - 1],
          value.attr_id,
          {
            attr_name: value.attr_name,
            attr_sel: value.attr_sel,
            attr_vals: value.attr_vals.join(' ')
          }
        )
        // res.data.meta.status === 200 为成功 其他都为失败
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 处理tag删除事件
    handleTagClose(index, value) {
      // 删除数组中的数据
      value.attr_vals.splice(index, 1)
      // 发请求删除数据库数据
      this._saveAttrChange(value)
    }
  },
  created() {
    this._getCategories()
  }
}
</script>
<style lang='less' scoped>
.cascader-margin {
  margin: 15px 0;
}
.input-new-tag {
  width: 15%;
}
</style>
