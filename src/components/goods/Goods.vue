<template class="goods-container">
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加 -->
      <el-row :gutter="10">
        <!-- 搜索 -->
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="handleClear">
            <el-button slot="append" icon="el-icon-search" @click="_getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加 -->
        <el-col :span="12">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="goodsList" stripe border style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150px">
          <template v-slot:default="scope">{{scope.row.add_time | moment}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="_showEditDialog(scope.row.goods_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="_removeGoodById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        :page-sizes="[5, 10, 20, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      goodsList: [],
      total: 0,
      queryInfo: { query: '', pagenum: 1, pagesize: 5 },
      addDialogVisible: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取商品列表
    async _getGoodsList() {
      try {
        const res = await this.$api.goods.getGoods(this.queryInfo)
        // 200为成功
        if (res.data.meta.status === 200) {
          // 将返回的数据保存到data中
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
          console.log(res.data.data)
          // 显示msg
          this.$message.success(res.data.meta.msg)
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
      this._getGoodsList()
    },
    // 处理pagenum改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this._getGoodsList()
    },
    // 搜索框清空处理
    handleClear() {
      this.queryInfo.query = ''
      this._getGoodsList()
    },
    // 删除商品
    _removeGoodById(goodId) {
      this.$confirm('是否删除商品?', '删除商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await this.$api.goods.removeGoods(goodId)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this._getGoodsList()
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
    // 编辑商品接口有问题
    _showEditDialog() {},
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('goods/add')
    }
  },
  created() {
    this._getGoodsList()
  }
}
</script>
<style lang='less' scoped>
</style>
