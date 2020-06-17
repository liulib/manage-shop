<template>
  <div class="rights-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightsData" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rightsData: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    //  获取权限列表
    async _getRightsList() {
      try {
        const res = await this.$api.rights.getRightsList('list')
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rightsData = res.data.data
          this.$message.success(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error(error)
      }
    }
  },
  created() {
    console.log('res')
    this._getRightsList()
  }
}
</script>
<style lang='less' scoped>
</style>
