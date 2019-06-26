/*
 * @Author: 尊贵的QQ会员 
 * @Date: 2019-06-22 18:44:54 
 * @Last Modified by: 尊贵的QQ会员
 * @Last Modified time: 2019-06-25 11:20:49
 */

export default {
  data() {
    return {
      tableForm: {
        query: "",
        pagenum: 1,
        pagesize: 7
      },
      searchkey: '',
      dataList: [], //商品数据
      total: 0
    }
  },
  methods: {
    search() {
      this.tableForm.query = this.searchkey;
      this.getDatalist();
    },
    handleSizeChange(val) {
      this.tableForm.pagesize = val;
    },
    handleCurrentChange(val) {
      this.tableForm.pagenum = val;
    }
  },
  watch: {
    tableForm: {
      deep: true,
      handler() {
        this.getDatalist();
      }
    }
  },
  created() {
    this.getDatalist();
  },
}