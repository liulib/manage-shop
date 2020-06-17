<template>
  <div class="home_container">
    <el-container class="container">
      <el-header>
        <div>
          <img src="../assets/logo.png" alt />
          <span>后台管理系统</span>
        </div>
        <div>
          <el-button type="info" @click="loginOut">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏菜单 -->
        <el-aside :width="isSwitch?'64px':'200px'">
          <div class="menuSwitch" @click="switchCollapse">|||</div>
          <el-menu
            background-color="#323744"
            text-color="#fff"
            active-text-color="#4095fb"
            :unique-opened="true"
            :collapse="isSwitch"
            :collapse-transition="false"
            :router="true"
            :default-active="navState"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="icons[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/'+subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menuList: [],
      icons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isSwitch: false,
      navState: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    //   获取侧边栏数据
    async _getMenu() {
      try {
        const res = await this.$api.operations.getMenuList()
        this.menuList = res.data.data
      } catch (error) {
        console.log(error)
      }
    },
    // 切换侧边栏状态
    switchCollapse() {
      this.isSwitch = !this.isSwitch
    },
    // 保存二级菜单激活状态
    saveNavState(navState) {
      window.sessionStorage.setItem('navState', navState)
      this.navState = navState
    },
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('login')
    }
  },
  created() {
    this._getMenu()
    this.navState = window.sessionStorage.getItem('navState')
  }
}
</script>
<style lang='less' scoped>
.home_container {
  height: 100%;
  .container {
    height: 100%;
    .el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 20px;
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          border-radius: 50%;
          width: 61px;
          height: 56px;
          margin-right: 15px;
        }
      }
    }
    .el-aside {
      background-color: #323744;
      .menuSwitch {
        background-color: #485163;
        color: #fff;
        font-size: 10px;
        line-height: 24px;
        letter-spacing: 0.3em;
        cursor: pointer;
        text-align: center;
      }
      .el-menu {
        border-right: none;
      }
    }
    .el-main {
      background-color: #eaedf2;
    }
  }
}
</style>
