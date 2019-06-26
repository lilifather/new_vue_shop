<template>
  <div class="addGoods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-steps :active="active-0" finish-status="success" simple>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs v-model="active" tabPosition="left" :before-leave="beforeleave">
        <el-tab-pane label="基本信息" name="0">
          <el-form ref="goodsrole" :rules="addgoodsRoles" :model="addGoodsForm" label-width="80px">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" placeholder="请输入商品价格"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" placeholder="请输入商品重量(默认kg)"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" placeholder="请输入商品数量"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="catlist"
                :props="{label:'cat_name',value:'cat_id',expandTrigger:'hover'}"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <el-button type="primary" size="small" @click="next">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <div class="primary" v-for="(item, index) in goodsparam" :key="index">
            <p>{{item.attr_name}}</p>
            <el-checkbox-group v-model="goodsParamValues">
              <el-checkbox
                :label="item1"
                border
                v-for="(item1, index1) in item.attr_vals.split(' ')"
                :key="index1"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button type="primary" size="small" @click="second">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form ref="form" label-width="150px">
            <el-form-item :label="item.attr_name" v-for="(item, index) in goodsattr" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" size="mini" @click="third">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="axios.defaults.baseURL + 'upload'"
            :headers="{
                  Authorization:token
             }"
            :on-success="uploadSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
           <m-quill-editor 
              :has-border="quill.border"
              v-model="addGoodsForm.goods_introduce"
              :sync-output="quill.syncOutput"
              :theme="quill.theme"
              :disabled="quill.disabled"
              :fullscreen="quill.full"
              @upload="editorupload"
              >
           </m-quill-editor>
           <el-button type="primary" size="mini" @click='ok'>完成</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import MQuillEditor from 'vue-m-quill-editor'
export default {
  components:{
    MQuillEditor
  },
  data() {
     var searchGoods = async (rule, value, callback) => {
        let paramsgoods = {
            query:value,
            pagenum:1,
            pagesize:1,
        }
        let a = await this.axios.get("goods",{
          params:paramsgoods
        })
        if(a.data.data.goods.length > 0) {
          callback(new Error('商品名称已存在'))
        }
      };
    return {
      quill: {
        border: true,
        content: 'wellcome ~',
        syncOutput: true,
        theme: 'snow', //bubble snow
        disabled: false,
        full: false,
      },
      token: sessionStorage.getItem("token"),
      fileList: [],
      goodsParamValues: [],
      active: "0",
      addGoodsForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce:'',
        goods_cat: [],
        pics:[],
        attrs: []
      },
      catlist: [], //分类列表数据
      goodsparam: [], //该分类下的商品参数
      goodsattr: [], //保存的商品属性
      addgoodsRoles: {
        goods_name: [{
          required: true,
          message: "商品名称不能为空",
          trigger: "blur"
        },
        {
          validator:searchGoods,
          trigger:['change','blur']
        }],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
          {
            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/,
            message: "商品价格不规范",
            trigger: ["blur", "change"]
          }
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]([0-9])*$/,
            message: "商品数量不规范",
            trigger: ["blur", "change"]
          }
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
          {
            pattern: /^[0-9]+.?[0-9]*$/,
            message: "商品重量不规范",
            trigger: ["blur", "change"]
          }
        ],
        goods_cat: {
          required: true,
          message: "商品分类不能为空",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    async ok(){
      let res = await this.axios.post("goods",this.addGoodsForm)
      if(res.data.meta.status != 201){
        return this.$message.error('添加失败')
      }else{
        this.$message.success('添加成功')
        this.$router.push('goods')
      }
      console.log(res)
    },
    editorupload (file, insert) {
      let reader = new FileReader()
      console.log(reader)
      reader.onloadend = (e)=>{
        insert(e.target.result, 'center')
      }
      reader.readAsDataURL(file)
    },
    beforeleave(activeName,oldActiveName){
      if(this.addGoodsForm.goods_cat == ''){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //上传图片成功后的回调函数
    uploadSuccess(response, file, fileList){
        if(response.meta.status != 200){
        this.$message.error('上传文件失败');
        //删除文件  
        let index = fileList.findIndex(v=>{
          return v.uid = file.uid
        })
        fileList.splice(index,1)
        }else{
          this.$message.success('上传图片成功')
          //把返回的路径保存到数组
          this.addGoodsForm.pics.push({
            pic:response.data.tmp_path
          })
        }
        
    },
    next() {
      this.$refs["goodsrole"].validate(async v => {
        if (v) {
          //保存商品信息
          this.active = parseInt(this.active) + 1 + ""; //狗日的转来转去
          let goods_cat = this.addGoodsForm.goods_cat;
          let id = goods_cat[goods_cat.length - 1];
          //获取商品属性
          let attrdata = await this.axios.get(`categories/${id}/attributes`, {
            params: {
              sel: "only"
            }
          });
          this.goodsattr = attrdata.data.data;

          //获取商品参数
          let goodparams = await this.axios.get(`categories/${id}/attributes`, {
            params: {
              sel: "many"
            }
          });
          this.goodsparam = goodparams.data.data;
          //将数组转成字符串
          this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(",");
        }
      });
    },
    second() {
      this.active = parseInt(this.active) + 1 + "";
      // this.attrs = this.goodsParamValues
    },
    third() {
      this.active = parseInt(this.active) + 1 + "";
    }
  },
  async created() {
    let { data: res } = await this.axios.get("categories");
    this.catlist = res.data;
  }
};
</script>
<style lang="stylus">
.addGoods {
  .el-steps {
    margin-bottom: 25px;
  }
}
.primary {
  margin-bottom: 20px;
}
</style>
