import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueHtmlToPaper from 'vue-html-to-paper'
import vuetify from './plugins/vuetify';
import VueRecord from '@codekraft-studio/vue-record'
import VueMoment from 'vue-moment'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "../node_modules/jquery/dist/jquery.min.js"
import "../node_modules/popper.js/dist/popper.min.js"
import "../node_modules/bootstrap/dist/js/bootstrap.js"

const url1 = 'https://deutsch-lehrer.herokuapp.com';
const url2 = 'http://localhost:5000'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
  ]
}
Vue.use(VueHtmlToPaper, options);
Vue.use(Vuelidate);
Vue.use(VueRecord);
Vue.use(VueMoment);
axios.defaults.baseURL = url2;
axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// export const url = url2;
export const eventBus = new Vue();
