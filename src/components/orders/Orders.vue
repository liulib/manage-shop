<template>
  <div class="orders-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="10">
        <!-- 搜索 -->
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="handleClear">
            <el-button slot="append" icon="el-icon-search" @click="_getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="orderList" stripe border style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80px">
          <template v-slot:default="scope">
            <el-tag size="mini" type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag size="mini" type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="150px">
          <template v-slot:default="scope">{{scope.row.create_time | moment}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogVisible = true"
            >编辑</el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showLogisticsDialog"
            >物流</el-button>
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
    <!-- 编辑地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="handleEditClose">
      <!-- 内容主体区域 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="省市区/县" required prop="address1">
          <!-- 分类数据的级联选择框 -->
          <el-cascader expand-trigger="hover" :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" required prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleEditClose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示物流 信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="logisticsDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logistics"
          :key="index"
          :timestamp="item.ftime"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../utils/citydata'
export default {
  components: {},
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      orderList: [],
      total: 0,
      editDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择收获地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      logistics: [],
      logisticsDialogVisible: false
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取订单数据
    async _getOrderList() {
      try {
        const res = await this.$api.orders.getOrderList(this.queryInfo)
        if (res.data.meta.status === 200) {
          // 将数据保存到data中
          this.orderList = res.data.data.goods
          this.total = res.data.data.total
          this.$message.success(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 搜索框清空处理
    handleClear() {
      this.queryInfo.query = ''
      this._getOrderList()
    },
    // 处理pagesize改变
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this._getOrderList()
    },
    // 处理pagenum改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this._getOrderList()
    },
    // 显示编辑对话框
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
    // 关闭后清空表单
    handleEditClose() {
      this.$refs.addressFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 获取物流信息
    async _getLogistics() {
      try {
        const res = await this.$api.orders.getLogistics()
        if (res.data.meta.status === 200) {
          // 将数据保存到data中
          this.logistics = res.data.data
          console.log(this.logistics)
          this.$message.success(res.data.meta.message)
        } else {
          this.$message.error(res.data.meta.message)
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 显示物流信息对话框并获取物流信息
    showLogisticsDialog() {
      this._getLogistics()
      this.logisticsDialogVisible = true
    }
  },
  created() {
    this._getOrderList()
  }
}
</script>
<style lang='less' scoped>
</style>
