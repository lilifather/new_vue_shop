<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <div style="margin-bottom: 15px;">
            <el-button type="primary" size="small" @click="showDialog">添加角色</el-button>
          </div>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item, index) in scope.row.children" :key="index">
              <el-col :span="6">
                <el-tag
                  @close="handleClose(scope.row.id,item.id,scope.$index)"
                  closable
                >{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="18">
                <el-row v-for="(item1, index1) in item.children" :key="index1" class="showRoles">
                  <el-col :span="6">
                    <el-tag
                      @close="handleClose(scope.row.id,item1.id,scope.$index)"
                      closable
                      type="warning"
                    >{{item1.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="handleClose(scope.row.id,item2.id,scope.$index)"
                      type="danger"
                      closable
                      v-for="(item2, index2) in item1.children"
                      :key="index2"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- {{scope.row.children}} -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" label="权限id"></el-table-column>
        <el-table-column prop="roleName" label="权限名称"></el-table-column>
        <el-table-column prop="roleDesc" label="权限描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini"  @click="authorize(scope.row.id)">分配权限</el-button>
            <el-button type="primary" size="mini" @click="edit(scope.$index,scope.row.id)">修改</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色框 -->
    <el-dialog title="添加角色" :visible.sync="addDialog">
      <el-form :model="addform" :rules="addrules">
        <input type="text" v-model="addform.roleid">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addform.roleName" autocomplete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="textarea" :rows="4" v-model="addform.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialog">
      <el-form :model="addform" :rules="editrules">
        <input type="hidden" v-model="addform.roleid">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addform.roleName" autocomplete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="textarea" :rows="4" v-model="addform.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>

<!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="authDialog">
      <input type="hidden" v-model="NowRoleId">
      <el-tree
        ref="tree"
        :data="allqx"
        show-checkbox
        node-key="id"
         @check-change="handleCheckChange"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveQx">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      NowRoleId:'',
      defaultProps: {
          children: 'children',
          label: 'authName'
      },
      rids:[],  //权限id (字符串以,分割)
      rolesList: [],
      allqx:[],
      id: "",
      addDialog: false,
      editDialog: false,
      authDialog:false,
      addform: {
        roleid:"",
        roleName: "",
        roleDesc: ""
      },
      addrules: {
        roleName: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur"
        },
        roleDesc: { required: true, message: "请输入角色描述", trigger: "blur" }
      },
      editrules: {
        roleName: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur"
        },
        roleDesc: { required: true, message: "请输入角色描述", trigger: "blur" }
      }
    };
  },
  
  created() {
    this.getData();
  },
  methods: {
     handleCheckChange() {
       let res = this.$refs.tree.getCheckedNodes()
       let aids = []
       res.forEach(function(element, index, array){
         aids.push(element.id)
       })
       this.rids = aids
      },
      //确定授权
      async saveQx(){
        const ids = this.rids.join(',')
        console.log(ids)
        let params = {
          rids:ids
        }
        let {data:res} = await this.axios.post(`roles/${this.NowRoleId}/rights`,params)
        if(res.meta.status != 200) 
        return this.$message.error('更新失败')

        this.$notify.success({
          title:'提示',
          message:'角色授权成功'
        })
        this.authDialog = false
        this.getData()
      },
    //授权
    async authorize(roleid){
        this.authDialog = true
        //赋值该用户的权限id
        this.NowRoleId = roleid
        //查询所有权限
        let {data:res} = await this.axios.get('rights/tree')
        if(res.meta.status!=200)
        return this.$message.error('获取权限列表失败')
        this.allqx = res.data
      },
    showDialog() {
      this.addDialog = true;
      this.addform = {
        roleName: "",
        roleDesc: ""
      };
    },
    //修改权限用户信息
    async edit(index,id){
      this.editDialog = true
      console.log(this.rolesList[index])
      this.addform.roleid = this.rolesList[index].id
      this.addform.roleName =  this.rolesList[index].roleName
      this.addform.roleDesc =  this.rolesList[index].roleDesc
    },
    async editRole(){
      let {data:res} = await this.axios.put(`roles/${this.addform.roleid}`,this.addform)
      if(res.meta.status != 200 ) return this.$message.error('修改失败')
      this.$notify.success({
        title:'提示',
        message:'修改成功'
      })
      this.editDialog = false
      this.getData()
    },
    // 添加
    async addRole() {
      let { data: res } = await this.axios.post("roles", this.addform);
      if (res.meta.status != 201) return this.$message.error("创建角色失败");
      this.$notify.success({
        title: "提示",
        message: "创建成功"
      });
      this.addDialog = false;
      this.getData();
    },
    async getData() {
      let { data: res } = await this.axios.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限信息失败");
      }
      this.rolesList = res.data;
    },

    async handleClose(roleId, rightId, index) {
      let { data: res } = await this.axios.delete(
        `roles/${roleId}/rights/${rightId}`
      );
      if (res.meta.status != 200) return this.$message.error("取消失败");
      this.$notify.success({
        title: "提示",
        message: "取消权限成功"
      });
      this.getData();
      // this.rolesList = res.data
    },

    //   console.log(index)
    //   //  this.rolesList.splice(this.rolesList.indexOf(tag), 1);
    // },
    // handleClose1(iex,index,index1){

    //   console.log(index,index1)
    //   //  this.rolesList.splice(this.rolesList.indexOf(tag), 1);
    // },
    // handleClose2(iex,index,index1,index2){
    //   this.rolesList[iex].children[index].children[index1].children[index2])
    //   //  this.rolesList.splice(this.rolesList.indexOf(tag), 1);
    // },
    del(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await this.axios.delete(`roles/${id}`);
          if (res.meta.status != 200) {
            return this.$message.error("删除角色失败");
          }
          this.$notify.success({
            title: "提示",
            message: "删除成功!"
          });
          this.getData();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="stylus">
color = #e7e7e7;

.roles 
  .showRoles 
    border-bottom: 1px solid color
    margin-bottom: 10px

    .el-tag 
      margin-bottom: 10px
      margin-right: 10px
    
  

</style>

