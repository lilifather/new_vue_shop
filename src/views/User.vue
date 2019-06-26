<template>
  <div class="User">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                placeholder="请输入用户名"
                v-model="searchkey"
                @keydown.enter.native="search"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="AddDailog=true">添加用户</el-button>
            </el-col>
            <!-- <el-col :span="12" class="textRight">
              <el-button type="danger">批量删除</el-button>
            </el-col>-->
          </el-row>
        </span>
      </div>
      <div class="text item">
        <el-table
          :data="userList"
          tooltip-effect="dark"
          :header-cell-style="{background:'rgba(85, 126, 208)',color:'#ffffff'}"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role_name" label="权限名称"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch @change="changestate($event,scope.row)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="showEditDiaglog(scope.row)"
                icon="el-icon-edit"
                size="mini"
                circle
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="del(scope.row.id)"
                size="mini"
                circle
              ></el-button>
              <el-tooltip effect="dark" content="分配权限" placement="top">
                <el-button type="warning" icon="el-icon-s-tools" size="mini" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页数据 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableForm.pagenum"
          :page-sizes="[7, 15, 25, 35]"
          :page-size="tableForm.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加用户弹出框 -->
    <el-dialog @closed="$refs.addRuleform.resetFields()" title="添加用户" center :visible.sync="AddDailog">
      <el-form :model="addUserForm" :rules="addRules" ref="addRuleform" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="addUserForm.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddDailog = false">取 消</el-button>
        <el-button type="primary" @click="addUserinfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息弹框 -->
    <el-dialog title="编辑用户" center :visible.sync="Editdialog">
      <el-form :model="editUserinfo" :rules="editRules" label-width="80px">
        <el-form-item label="用户id">
          <el-input v-model="editUserinfo.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserinfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserinfo.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUserinfo.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Editdialog = false">取 消</el-button>
        <el-button type="primary" @click="edit(editUserinfo.id)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义验证用户名
    let checkusername = async (rule, value, callback) => {
        let userData = {
          query:value,
          pagenum:1,
          pagesize:1
        }
        let a =  await this.axios.get('users',{params:userData})
        if(a.data.data.total >0)
             callback(new Error('用户名已存在'));
        callback()
      };
    return {
      tableForm: {
        query: "",
        pagenum: 1,
        pagesize: 7
      },
      userList: [],
      total: 0, //总页数
      searchkey: "", //查询的值
      Editdialog: false, //控制编辑框是否显示
      AddDailog: false,
      editUserinfo: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkusername, trigger: ["blur","change"] }
          ],
        password: { required: true, message: "请输入密码", trigger: "blur" },
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {pattern:/^1[3|4|5|7|8][0-9]\d{8}$/,message:'手机号码格式不正确',trigger: ["blur", "change"]}
        ]
      },
      editRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: checkusername, trigger: ["blur","change"] }
          ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {pattern:/^1[3|4|5|7|8][0-9]\d{8}$/,message:'手机号码格式不正确',trigger: ["blur", "change"]}
        ]
      }
    };
  },
  watch: {
    tableForm: {
      deep: true,
      handler() {
        this.getUserlist();
      }
    }
  },
  methods: {
    async changestate(val,row){
        const res= await this.axios.put(`users/${row.id}/state/${row.mg_state}`)
        if(res.data.meta.status != 200) {
          setTimeout(()=>{
              row.mg_state = !row.mg_state
          },1500)
          return this.$message.error("修改状态失败");
        }
         this.getUserlist()
    },
    //添加用户信息
    addUserinfo() {
      this.$refs["addRuleform"].validate(async valid => {
        if (valid) {
          const res = await this.axios.post("users",this.addUserForm)
          if(res.data.meta.status != 201) {
             return this.$message.error("添加失败");
          }
            this.$notify.success({
              title: "提示",
              message: "添加成功"
            });
            this.AddDailog = false
            this.getUserlist()

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除用户
    del(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.axios.delete(`users/${id}`);
          if (res.data.meta.status != 200)
            return this.$message.error("删除失败");
          this.$notify.success({
            title: "提示",
            message: "删除成功"
          });
          this.getUserlist();
        })
        .catch(() => {});
    },
    //修改用户
    async edit(id) {
      const res = await this.axios.put(`users/${id}`, this.editUserinfo);
      if (res.data.meta.status != 200)
        return this.$message.error("修改失败" + res.data.meta.msg);

      this.$notify.success({
        title: "提示",
        message: "更新成功"
      });
      this.getUserlist();
      this.Editdialog = false;
    },
    showEditDiaglog(data) {
      this.Editdialog = true;
      //将data的数据放到数组中
      this.editUserinfo.id = data.id;
      this.editUserinfo.email = data.email;
      this.editUserinfo.username = data.username;
      this.editUserinfo.mobile = data.mobile;
    },
    //查询用户数据
    search() {
      this.tableForm.query = this.searchkey;
      this.getUserlist();
    },
    handleSizeChange(val) {
      this.tableForm.pagesize = val;
    },
    handleCurrentChange(val) {
      this.tableForm.pagenum = val;
    },
    // 获取用户数据
    async getUserlist() {
      let userData = await this.axios.get("users", { params: this.tableForm });
      if (userData.data.meta.status != 200) {
        return this.$message.error("获取列表数据失败");
      }
      this.userList = userData.data.data.users;
      this.total = userData.data.data.total;
    }
  },
  created() {
    this.getUserlist();
  }
};
</script>
<style lang="stylus">
</style>


