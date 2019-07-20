<template>
  <div class="orders">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row style="margin-bottom:15px">
        <el-col :span="6">
          <el-input placeholder="请输入查询" v-model="credparams.query" class="input-with-select" @keydown.native="search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          </el-col>
      </el-row>
      <el-table :data="orderList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
        <template slot-scope="scope">
          <div>
              <el-tag v-if="scope.row.order_pay == 0 " type="danger">未付款</el-tag>
              <el-tag v-else type="success">已付款</el-tag>
          </div>
        </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" :formatter="timestampToTime" label="下单时间"></el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
             <el-button type="primary" size="small" @click="wuliu(scope.row)">修改</el-button>
             <el-button type="danger" size="small" >查看物流</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="credparams.pagenum"
        :page-sizes="[10,15,20,25]"
        :page-size="credparams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改弹出框 -->
    <el-dialog title="修改订单信息" :visible.sync="wuliuDialog">
      <el-form :model="editOrder" label-width="80px">
          <el-form-item label="详细地址" >
                <el-cascader
                    :options="cityOptions"
                    :value="city"
                    @change="changeProvince"
                    change-on-select
                  >
          </el-cascader>
          </el-form-item>
          <!-- <el-form-item label="详细地址" >
            <el-input placeholder="请输入详细地址"></el-input>
          </el-form-item> -->
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="wuliuDialog = false">取 消</el-button>
          <el-button type="primary" @click="wuliuDialog = false">确 定</el-button>
        </div>
      </el-dialog>
  {{cityOptions}}
  </div>
</template>
<script>
import order from './orders.js'
import cityOptions from '../../assets/city.js'

export default {
  mixins:[order]
}
</script>
<style lang="stylus">

</style>

