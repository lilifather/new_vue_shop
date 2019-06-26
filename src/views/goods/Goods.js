/*
 * @Author: 尊贵的QQ会员 
 * @Date: 2019-06-22 18:44:54 
 * @Last Modified by: 尊贵的QQ会员
 * @Last Modified time: 2019-06-22 19:35:57
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
    }
  },
}