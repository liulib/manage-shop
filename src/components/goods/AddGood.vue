<template class="add-goods-container">
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" type="info" :closable="false" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- Tabs标签页 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 商品分类的级联选择框 -->
              <el-cascader
                :options="CategoriesList"
                :props="cascaderProps"
                v-model="selectedKeys"
                @change="parentCateChange"
                show-all-levels
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 循环渲染表单 -->
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="item1 in item.attr_vals"
                  :key="item1.attr_id"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 循环渲染表单 -->
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="item1 in item.attr_vals"
                  :key="item1.attr_id"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传组件 -->
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="previewHandler"
              :on-remove="removeHandler"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadHandler"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <el-button type="primary" @click="addGoods" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" alt="预览图片" class="preImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      activeIndex: '0',
      CategoriesList: [],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        picData: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //   级联选择器规则
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedKeys: [],
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      dialogVisible: false,
      editorOption: {}
    }
  },
  computed: {
    //   计算选择的三级ID
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    }
  },
  watch: {},
  methods: {
    // 获取分类数据
    async _getCategories() {
      try {
        const res = await this.$api.goods.getCategories()
        // 200为成功
        if (res.data.meta.status === 200) {
          // 将返回的数据保存到data中
          this.CategoriesList = res.data.data
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
      }
      this.addForm.goods_cat = this.selectedKeys.join(',')
      console.log(this.addForm)
    },
    // tab离开的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.selectedKeys.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 根据ID获取属性
    async _getAttributesById(tabValue) {
      try {
        const res = await this.$api.goods.getAttributesById(this.cateId, {
          sel: tabValue
        })
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
          if (tabValue === 'many') {
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
    // 处理tab点击事件
    tabClick() {
      // 为1则是动态参数
      if (this.activeIndex === '1') {
        this._getAttributesById('many')
      } else if (this.activeIndex === '2') {
        this._getAttributesById('only')
      }
    },
    // 上传成功钩子函数
    uploadHandler(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.picData.push(picInfo)
      if (response.meta.status === 200) {
        this.$message.success(response.meta.msg)
      } else {
        this.$message.error(response.meta.msg)
      }
      console.log(this.addForm)
    },
    // 移除上传钩子函数
    removeHandler(file) {
      const filePath = file.response.data.tmp_path
      const picIndex = this.addForm.picData.findIndex(
        item => item.pic === filePath
      )
      this.addForm.picData.splice(picIndex, 1)
      console.log(this.addForm)
    },
    // 预览事件处理函数
    previewHandler(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写完整的表单数据')
        }
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 发起请求
        this._addGoods()
        // 跳转到商品页面
        this.$router.push('/goods')
      })
    },
    // 添加商品的请求
    async _addGoods() {
      try {
        const res = await this.$api.goods.addGoods(this.addForm)
        // 201为成功
        if (res.data.meta.status === 201) {
          // 显示msg
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    }
  },
  created() {
    this._getCategories()
  }
}
</script>
<style lang='less' scoped>
.el-steps {
  margin: 20px 0;
}

.el-checkbox {
  margin: 0 10px 0 0;
}

.preImg {
  width: 100%;
}

.addBtn {
  margin: 10px 0;
}
</style>
