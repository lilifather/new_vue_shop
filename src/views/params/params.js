export default{
  data() {
    return {
      addDialog:false,
      addDialog2:false,
      addForm:{
        attr_name:'',
        attr_sel:'many'
      },
      addJingtai:{
        attr_name:'',
        attr_sel:'only'
      },
      catlist:[],
      cateids:[],
      cateparams:[],  //动态参数
      catelist:[],    //静态参数
      activeName: 'first',
      addFormRoles:{
        attr_name:{required:true,message:'请输入参数',trigger:'blur'}
      }
    }
  },
  async created() {
    let {data:res} = await this.axios.get('categories')
    if(res.meta.status != 200 )
      return this.$message.error('获取商品分类数据失败')
    this.catlist = res.data

  },
  methods: {
    showaddDialog(){
      if(this.cateids == '')
      return this.$message.error('请先选择商品分类')
      this.addDialog = true
    },
    showaddDialog2(){
      if(this.cateids == '')
      return this.$message.error('请先选择商品分类')
      this.addDialog2 = true
    },
    //确认保存参数
    async addSave(){
        let id = this.cateids[this.cateids.length-1]
        let {data:res} = await this.axios.post(`categories/${id}/attributes`,this.addForm)
        if(res.meta.status != 201)
          return this.$message.error('创建参数失败')

        this.$notify.success({
          title:'提示',
          message:'创建参数成功'
        })
        this.getCateparams()
        this.addDialog = false
    },
    //确认静态属性
    async addSaveJT(){
      let id = this.cateids[this.cateids.length-1]
      let {data:res} = await this.axios.post(`categories/${id}/attributes`,this.addJingtai)
      if(res.meta.status != 201)
        return this.$message.error('创建静态属性失败')

      this.$notify.success({
        title:'提示',
        message:'创建静态属性成功'
      })
      this.getCatelist()
      this.addDialog2 = false
    },
  //获取动态参数
   async getCateparams(){
    let id = this.cateids[this.cateids.length-1]
    let {data:res} = await this.axios.get(`categories/${id}/attributes`,{params:{
     sel:'many'
    }})
    if(res.meta.status != 200) 
     return this.$message.error('获取动态参数失败')
     this.cateparams = res.data
   },

   async getCatelist(){
    let id = this.cateids[this.cateids.length-1]
    let {data:res} = await this.axios.get(`categories/${id}/attributes`,{params:{
     sel:'only'
    }})
    if(res.meta.status != 200) 
     return this.$message.error('获取静态参数失败')
     this.catelist = res.data
     console.log(this.catelist )
   },
  },
  watch: {
      cateids(){
      this.getCateparams()
      this.getCatelist()
    }
  },
}