// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vuex from 'vuex';
import i18n from './i18n/i18n';
import './assets/icon/iconfont.css';            //阿里图标库
//import FastClick from 'fastclick';              //去除移动端延迟

Vue.use(ElementUI);
Vue.use(vuex);

//vuex
import store from './store'

Vue.config.productionTip = false

//FastClick
// FastClick.attach(document.body);

// FastClick.prototype.onTouchEnd = function (event) {
//   if (event.target.hasAttribute("type") && event.target.getAttribute("type") == "text") {
//     event.preventDefault();
//     return false;
//   }
// }


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //使用store
  i18n,
  components: { App },
  template: '<App/>'
})
