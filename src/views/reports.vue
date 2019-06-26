<template>
  <el-card>
      <div id="main" style="width: 100%;height:500px;"></div>
  </el-card>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
 async mounted(){
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.axios.get("reports/type/1");
        if(res.meta.status != 200){
          return this.$message.error('获取图标数据失败')
        }

        const options = {
          title: {
            text: "用户来源"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#E9EEF3"
              }
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ]
        };
        // 指定图表的配置项和数据
        var newdata = _.merge(options,res.data)

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(newdata);
  }
}
</script>
<style lang="stylus">
    
</style>
