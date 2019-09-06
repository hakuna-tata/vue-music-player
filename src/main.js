// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import VConsole from 'vconsole'

import './assets/scss/index.scss'

// /* eslint-disable no-unused-vars*/
var vConsole = new VConsole();

console.log("test")

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('@/assets/image/default.png')
})

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
