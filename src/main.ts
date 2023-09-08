/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

// fonts & icons
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n';
import vueHttp from './plugins/httpClient';
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts';

import './registerServiceWorker';
import router from './router';
import store from './store';
import './theme/style.scss';

Vue.use(vueHttp);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

if (!window.Promise) {
  window.Promise = Promise;
}

Vue.config.productionTip = false;
const vm = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app');

export const $http = vm.$http;
