<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert style="margin-bottom: 15px;" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      请选择商品分类: 
      <el-cascader style="margin-bottom: 15px;"
        v-model="cateids"
        :options="catlist"
        :props="{label:'cat_name',value:'cat_id',expandTrigger:'hover'}"
      ></el-cascader>
      <el-tabs v-model="activeName" left>
        <el-tab-pane label="动态参数" name="first">
           <el-button type="primary" size="small" style="margin-bottom:10px" @click="showaddDialog">添加参数</el-button>
           <el-table :data="cateparams" border>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
              <el-table-column label="操作">
                  <template>
                    <el-button type="primary" size="small">修改</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
              </el-table-column>
           </el-table>

        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
           <el-button type="primary" size="small" style="margin-bottom:10px" @click="showaddDialog2">添加属性</el-button>
          <el-table :data="catelist" border>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
              <el-table-column label="操作">
                  <template>
                    <el-button type="primary" size="small">修改</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
              </el-table-column>
           </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
    <!-- 添加动态参数弹框 -->
    <el-dialog title="添加动态参数" :visible.sync="addDialog">
        <el-form :model="addForm" :rules="addFormRoles" ref="addForm">
          <el-form-item label="参数名称" label-width="100px" prop="attr_name">
            <el-input v-model="addForm.attr_name" autocomplete="off" placeholder="请输入参数名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addSave">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 添加静态参数弹框 -->
    <el-dialog title="添加静态属性" :visible.sync="addDialog2">
        <el-form :model="addJingtai" :rules="addFormRoles" ref="addForm">
          <el-form-item label="静态属性" label-width="100px" prop="attr_name">
            <el-input v-model="addJingtai.attr_name" autocomplete="off" placeholder="请输入参数名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog2 = false">取 消</el-button>
          <el-button type="primary" @click="addSaveJT">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import params from "./params.js";
export default {
  mixins: [params]
};
</script>
<style lang="stylus"></style>
