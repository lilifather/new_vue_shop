<template>
  <div class="login">
    <div class="bg">
      <img src="../assets/images/login_bg1.jpg" class="bg1" alt>
      <img src="../assets/images/login_bg2.png" class="bg2" alt>
    </div>
    <div class="form">
      <img src="../assets/images/logo.png" class="logo" alt="">
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async submitForm(loginForm) {
      this.$refs[loginForm].validate(async ok => {
        if (ok) {
          const d = await this.axios.post("login",this.loginForm)
          if(d.data.meta.status != 200) return this.$notify.error({title:"提示",message:"账号或密码错误"})
          console.log(d)
          //保存用户信息
          sessionStorage.setItem('token',d.data.data.token)
          sessionStorage.setItem('username',d.data.data.username)
          this.$message.success('登录成功');
          this.$router.push('/')
        } else {
          return false
        }
      });
    }
  }
};

</script>
<style lang="less">
.login {
  height: 100%;
  width: 100%;
  background-color: #f1f3f8;
  .bg {
    .bg1 {
      position: absolute;
      right: 0;
      top: 0;
    }
    .bg2 {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 58%;
    }
  }
  .form{
    width: 290px;
    background: #fff;
    box-shadow: 5px 24px 18px #c6c6c6;
    position: absolute;
    left:50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding-bottom: 20px;
    .el-form{
      width: 85%;
      margin: 0 auto;
      button{
        width: 100%;
        font-size: 13px;
        background: #5b83fa;
      }
    }
    .el-form-item{
      margin-top:30px;
    }
    .logo{
      display: block;
      margin: 0 auto;
      width: 120px;
      padding: 30px 20px;
    }
  }
}
</style>

