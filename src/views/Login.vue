<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!-- 登录表单 -->
      <div class="form_box">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="iconfont icon-3702mima"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <!-- 登录、重置按钮 -->
          <el-form-item class="button_box">
            <el-button type="primary" @click="_login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    _login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          try {
            const res = await this.$api.users.login(this.loginForm)
            // res.data.meta.status === 200 为登录成功 其他都为失败
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              // 将token 存到本地sessionStorage
              window.sessionStorage.setItem('token', res.data.data.token)
              // 跳转到home页
              this.$router.push('home')
            } else {
              this.$message.error(res.data.meta.msg)
            }
          } catch (error) {
            this.$message.error(error)
          }
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px;
      padding: 5px;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .form_box {
      position: absolute;
      bottom: 0;
      padding: 0 10px;
      box-sizing: border-box;
      width: 100%;
      .button_box {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
