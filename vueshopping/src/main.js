import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font-ico/iconfont.css'
// 导入axios
import axios from 'axios'
// axios设置根目录
axios.defaults.baseURL = 'http://localhost:3000'
// 在Vue原型上绑定axios
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
