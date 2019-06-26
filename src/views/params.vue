<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <zk-table :data="paramsList" :expandType="false" :selectionType="false" :columns="columns" :show-header="props.showHeader">
      <template slot="category" scope="scope">
        <div>
           <el-tag v-if="scope.row._level == 1" type="primary">
                {{scope.row._level}}级
           </el-tag>
           <el-tag v-else-if="scope.row._level == 2" type="warning">
                {{scope.row._level}}级
           </el-tag>
           <el-tag v-else type="danger">{{scope.row._level}}级</el-tag>
        </div>
      </template>
      <template slot="youxiao" scope="scope">
        <div>
            <i v-if="scope.row.cat_deleted" style="color: green;font-size: 16px;" class="el-icon-success"></i>  
            <i v-else class="el-icon-error" style="color: red;font-size: 16px;"></i>  
        </div>
      </template>
        <template slot="caozuo">
          <div>
              <el-button type="success" size="mini">修改</el-button>
              <el-button type="danger" size="mini">删除</el-button>
          </div>
        </template>
    </zk-table>
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
      console.log(res.data.total)
    }
  },
}
</script>
<style lang="stylus">

</style>
