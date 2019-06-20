<template>
  <div class="home">
    <el-container>
      <el-header>
          <img src="../assets/images/indexLogo.png" class="index-logo" alt>
        <div class="user">
          欢迎大佬: {{username}}
          <i class="iconfont icon-guanji" @click="logout"></i>
        </div>
      </el-header>
      <el-container>
        <div class="main">
          <el-aside :width="collapse ? '65px' : '200px'">
            <el-row class="tac">
              <el-menu 
              default-active="2" 
              active-text-color="#557ed0" 
              :collapse="collapse" 
              :collapse-transition="false"
              :router="true">
                <el-submenu index="1" v-for="(item, index) in menus" :key="index" :index="item.path">
                  <template slot="title">
                    <!-- 这里不能使用循环,使用属性的数组 写法 -->
                    <i :class="['iconfont',icons[index]]"></i>
                    <span>{{item.authName}}</span>
                  </template>
                  <el-menu-item
                    index="1-1"
                    v-for="(item1, index1) in item.children"
                    :key="index1"
                    :index="item1.path"
                  >{{item1.authName}}</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-row>
          <i class="el-icon-s-fold collIcon" @click="collapse=!collapse"></i>

          </el-aside>
        </div>
        <el-container>
          <el-main>Main</el-main>
          <el-footer>Author: 上海黑马php20期 韩斌</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      menus: [],
      icons: [
        "icon-yonghu1",
        "icon-quanxian",
        "icon-shangpin-",
        "icon-huabanfuben",
        "icon-tongji"
      ],
      collapse: false
    };
  },
  methods: {
    logout() {
      this.$confirm("是否确认退出", "你好: " + this.username, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        sessionStorage.clear();
        this.$notify.success({
          title: "提示",
          message: "退出成功"
        });
        this.$router.push("/login");
      });
    }
  },
  async created() {
    //获取用户名信息
    const username = sessionStorage.getItem("username");
    this.username = username;
    //获取左侧菜单栏
    const menus = await this.axios.get("menus", {
      headers: {
        Authorization: sessionStorage.getItem("token")
      }
    });
    console.log(menus.data.data);
    this.menus = menus.data.data;
  }
};
</script>
<style lang="less">
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-footer {
      display: flex;
      align-items: center;
    }
    .main {
      box-shadow: 3px 7px 4px 0 rgba(0, 0, 0, 0.08);
      padding-top: 3px;
      position:relative;
      .collIcon{
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          background: #a9a7a769;
          height: 40px;
          text-align: center;
          cursor: pointer;
          color: #5a5a5a;
          font-size: 23px;
          line-height: 40px;
        }
      .el-menu {
        border-right: none;
        color: #ccc;
        user-select: none;  
        .el-menu-item {
          padding-left: 60px !important;
          color: #7a7a7a;
        }
        .iconfont {
          font-size: 20px;
          margin-right: 10px;
          color: rgba(85, 126, 208, 0.8);
        }
      }
    }
  }
  .el-header {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    .index-logo {
      width: 100px;
    }
    .user {
      vertical-align: middle;
      user-select: none;
      i {
        font-size: 20px;
        margin-left: 20px;
      }
    }
  }
}
</style>


