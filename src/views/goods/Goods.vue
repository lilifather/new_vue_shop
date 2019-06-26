<template>
  <div class="Goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                placeholder="请输入商品名称"
                v-model="searchkey"
                @keydown.enter.native="search"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <router-link to="/addGoods">
                <el-button type="primary">添加商品</el-button>
              </router-link>
            </el-col>
          </el-row>
        </span>
      </div>
      <el-table
        :data="dataList"
        tooltip-effect="dark"
        :header-cell-style="{background:'rgba(85, 126, 208)',color:'#ffffff'}"
        style="width: 100%"
      >
        <el-table-column type="index" width="55"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间"></el-table-column>
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
              @click="del(scope.row.goods_id)"
              size="mini"
              circle
            ></el-button>
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
    </el-card>
  </div>
</template>
<script>
import goods from "./Goods.js";
import comData from "../common.js";
export default {
  mixins: [goods, comData],
  methods: {
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.axios.delete(`goods/${id}`);
          if (res.data.meta.status != 200) {
            return this.$message.error("删除失败");
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getDatalist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="stylus"></style>
