/*
 * @Author: 尊贵的QQ会员 
 * @Date: 2019-06-22 18:44:54 
 * @Last Modified by: 尊贵的QQ会员
 * @Last Modified time: 2019-06-27 21:29:53
 */

export default{
  //直接获取
  methods: {
     // 直接定义获取数据
     async getDatalist() {
      let Data = await this.axios.get("goods", { params: this.tableForm });
      if (Data.data.meta.status != 200) {
        return this.$message.error("获取列表数据失败");
      }
      this.dataList = Data.data.data.goods;
      this.total = Data.data.data.total;
    },
    timestampToTime (row, column) {
      var date = new Date(row.add_time*1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y+M+D+h+m+s
        console.log(timestampToTime (1533293827000))
    }
  },
}