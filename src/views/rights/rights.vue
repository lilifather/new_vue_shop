<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data="roleList" border>
          <el-table-column sortable label="权限id" prop="id"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="权限层级" >
          <template slot-scope="scope">
            <!-- {{scope.row.level}} -->
              <el-tag v-if="scope.row.level == 0" type="parimary">一级</el-tag>
              <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
              <el-tag v-else type="warning">三级</el-tag>
          </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
import rights from './rights.js'
export default {
  mixins:[
    rights
  ]
}
</script>
<style lang="stylus">

</style>
