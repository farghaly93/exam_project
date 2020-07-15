import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueHtmlToPaper from 'vue-html-to-paper'
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "../node_modules/bootstrap/dist/js/bootstrap.js"
import "../node_modules/popper.js/dist/popper.min.js"
import "../node_modules/jquery/dist/jquery.min.js"
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import vuetify from './plugins/vuetify';
const url = 'https://germany-exam.herokuapp.com';
const url2 = 'http://localhost:3001'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueHtmlToPaper, options);
Vue.use(Vuelidate);
axios.defaults.baseURL = url2;
axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

export const eventBus = new Vue();
