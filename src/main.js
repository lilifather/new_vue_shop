import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

//elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入日期插件
import moment from 'moment'

Vue.filter('dateFmt', (input, formatString = "YYYY-MM-DD") => {  
   //es5函数参数设置默认值    //const lastFormatString = formatString || ''         
  // moment(input) 把时间字符串转成时间对象     
  // format(formatString) 把时间对象，按照指定格式，格式化成符合条件的字符串    
  return moment(input).format(formatString)
})



//设置axios基本请求地址
Vue.axios.defaults.baseURL="http://127.0.0.1:11333/api/private/v1/"

// 添加一个请求拦截器
Vue.axios.interceptors.request.use(function (config) {
    config.headers = {
      Authorization: sessionStorage.getItem('token')
    }
    return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


import './assets/common.css';
import './assets/icon/iconfont.css'


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
