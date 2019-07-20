export default {
  data() {
    return {
      roleList:[]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleSelectionChange(val){
        console.log(1)
    },
    //获取基本数据
    async getData(){
      let {data:res} = await this.axios.get('rights/list')
      if(res.meta.status != 200 )
        return this.$message.error('获取权限列表失败')
      console.log(res.data)
      this.roleList = res.data
    }
  },
}