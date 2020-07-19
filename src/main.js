// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
//引入样式重置表
import './assets/css/reset.css'

//引入前端UI框架
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUi);

//引入 axios
// import axios from 'axios';
// Vue.prototype.$http = axios;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
