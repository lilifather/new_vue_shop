<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row style="margin-buttom：10px">
        <el-col :span="24">
          <el-button @click="addCategory" type="primary" size="small" style="margin-bottom: 10px;">添加分类</el-button>
        </el-col>
      </el-row>
    <zk-table :data="paramsList" :expandType="false" :selectionType="false" :columns="columns" :show-header="props.showHeader">
      <template slot="category" scope="scope">
        <div>
           <el-tag v-if="scope.row._level == 1" type="primary">
                {{scope.row._level}}级
           </el-tag>
           <el-tag v-else-if="scope.row._level == 2" type="success">
                {{scope.row._level}}级
           </el-tag>
           <el-tag v-else type="danger">{{scope.row._level}}级</el-tag>
        </div>
      </template>
      <template slot="youxiao" scope="scope">
        <div>
            <i v-if="scope.row.cat_deleted" style="color: red;font-size: 16px;" class="el-icon-error"></i>  
            <i v-else class="el-icon-success" style="color: green;font-size: 16px;"></i>  
        </div>
      </template>
        <template slot="caozuo" scope="scope">
          <div>
              <el-button type="success" size="mini" @click="editshow(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
          </div>
        </template>
    </zk-table>
    </el-card>
    <!-- 分页 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="fanye.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="fanye.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <!-- 添加分类弹出框 -->
          <el-dialog title="添加分类" center :visible.sync="addDialog">
              <el-form :model="addform">
                <el-form-item label="分类名称" label-width="100px">
                  <el-input v-model="addform.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="选择类别" label-width="100px">
                <el-cascader
                  v-model="addCateIds"
                  :options="addSaveData"
                  :props="{label:'cat_name',value:'cat_id',expandTrigger:'hover'}"
                  @change="handleChange"></el-cascader>
                 </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="getaddSave">确 定</el-button>
              </div>
            </el-dialog>
            <!-- 修改分类弹出框 -->
          <el-dialog title="添加分类" center :visible.sync="editDialog">
              <el-form :model="addform">
                <input type="hidden" v-model="editForm.cat_id">
                <el-form-item label="分类名称" label-width="100px">
                  <el-input v-model="editForm.cat_name" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="editSave">确 定</el-button>
              </div>
            </el-dialog>
  </div>
</template>
<script>
import ZkTable from 'vue-table-with-tree-grid'
export default {
  components:{
    ZkTable
  },
  watch: {
    fanye:{
      deep:true,
      handler(){
        this.getdata()
      }
    }
  },
  data() {
    return {
      editDialog:false,
      editForm:{
          cat_id:'',
          cat_name:'',
      },  
      addDialog:false,

      addCateIds:[],
      addSaveData:[],
      addform:{
        cat_name:'',
        cat_pid:'',
        cat_level:''
      },
      paramsList:[],
      fanye:{
        pagenum:1,
        pagesize:5,
      },
      total:0,
      props: {
          showHeader: true,
        },
       columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            type:'template',
            template:'youxiao'
          },
          {
            label: '分类层级',
            prop: 'cat_level',
            type:'template',
            template:'category'
          },
          {
            label: '操作',
            minWidth: '200px',
            type: 'template',
            template: 'caozuo',
          },
        ],
    }
  },
   created() {
    this.getdata()   
  },
  methods: {
    //修改弹出框
    editshow(row){
      this.editDialog = true
      this.editForm.cat_id = row.cat_id
      this.editForm.cat_name = row.cat_name
    },
    //实现修改分类
    async editSave(){
      let id = this.editForm.cat_id
      let {data:res} = await this.axios.put(`categories/${id}`,this.editForm)
      if(res.meta.status !=200)
      return this.$message.error('更新分类失败')

      this.$notify.success({
        title:'提示',
        message:'更新成功'
      })
      this.editDialog = false
      this.getdata()
    },
    //实现删除分类
    del(row){
        let id = row.cat_id
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //先判断是不是子节点
          if(row.cat_level == 2){
            let res = await this.axios.delete(`categories/${id}`)
            if(res.data.meta.status != 200)
            return this.$message.error('删除失败')
          }else{
            return this.$message.error('请先删除子节点')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        // console.log(row)
    },
    //下拉三级菜单
      handleChange(value) {
        this.addform.cat_level = value.length
        if(value.length == 1){
          this.addform.cat_pid = 0
        }else{
          this.addform.cat_pid = value[1]
        }
      },
  //实现添加分类
     async getaddSave(){
       let params = {
          cat_name : this.addform.cat_name,
          cat_pid:this.addform.cat_pid,
          cat_level:this.addform.cat_level
       }
        let {data:res} = await this.axios.post('categories',params)
        if(res.meta.status != 201 )
         return this.$messahe.error('创建分类失败')
        this.$notify.success({
          title:'提示',
          message:'创建分类成功'
        })
        this.addDialog = false
        this.getdata()
        // console.log(res)
     },
    //点击添加分类
    async addCategory(){
        this.addDialog = true
        let {data:res} = await this.axios.get('categories',{params:{
          type:2
        }})
        if(res.meta.status != 200 )
         return this.$message.error('获取分类数据失败')
         this.addSaveData = res.data
        // console.log(res.data)

    },
    handleSizeChange(val){
        this.fanye.pagesize = val
    },
    handleCurrentChange(val){
        this.fanye.pagenum = val
    },
    async getdata(){
      let paramData = {
          pagenum:this.fanye.pagenum,
          pagesize:this.fanye.pagesize
      }
      let {data:res} = await this.axios.get('categories',{params:paramData})
      this.paramsList = res.data.result
      this.total = res.data.total
      // console.log(res.data.total)
    }
  },
}
</script>
<style lang="stylus">

</style>
