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

import './assets/common.css';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
