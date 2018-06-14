import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import loading from './common/img/loading.gif'
import {Button} from 'mint-ui'
import './filters/index.js'
import './mock/apiMock'
import './common/stylus/fonts.styl'


/* eslint-disable no-new */
Vue.use(VueLazyload, {
  loading
})
Vue.component(Button.name, Button)
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
