
export default{
  data() {
    return {
      cityOptions: cityOptions,
      //修改订单数据
      editOrder:{

      },
      wuliuDialog:false,
      orderList:[],
      credparams:{
        query:'',
        pagenum:1,
        pagesize:6,
        user_id:'',
        pay_status:'',
        is_send:'',
        order_fapiao_title:'',
        order_fapiao_company:'',
        order_fapiao_content:'',
        consignee_addr:''
      },
      total:0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    //查询
    search(){
        
    },
    wuliu(row){
        this.wuliuDialog = true
        console.log(row)
    },
    handleSizeChange(val) {
      this.credparams.pagesize=val
    },
    handleCurrentChange(val) {
      this.credparams.pagenum=val
    },
    async getData(){
        let {data:res} = await this.axios.get('orders',{params:this.credparams})
        if(res.meta.status != 200) 
         return this.$message.error('获取初始数据失败')
         this.orderList = res.data.goods
         this.total = res.data.total
         console.log(this.orderList)
    },
    //转换时间
    timestampToTime (row, column) {
      var date = new Date(row.create_time*1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
  watch: {
    credparams:{
      deep:true,
      handler(){
        this.getData()
      }
    }
  },
}