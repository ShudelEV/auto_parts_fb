import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store/index'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme'
import VueStars from './plugins/plugin'
import NProgress from 'vue-nprogress'
import Cookies from 'js-cookie'

import App from './App.vue'

// Default axios default configuration
const axios_conf = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
    }
};

// Wrapper for integrating axios to Vuejs
// usage: this.axios.get() or this.$http.get()
Vue.use(VueAxios, axios.create(axios_conf));

// Tell Vue whether or not to show tips and warnings in the developer console of browser
Vue.config.productionTip = true;

// UIKit
Vue.use(Vuikit);
Vue.use(VuikitIcons);

// Stars
Vue.use(VueStars);

// Load Progrees Bar
const options = {
  latencyThreshold: 100, // Number of ms before progressbar starts showing, default: 100,
  router: true, // Show progressbar when navigating routes, default: true
  http: true // Show progressbar when doing Vue.http, default: true
};
Vue.use(NProgress, options);
const nprogress = new NProgress({ parent: '.nprogress-container' });

const app = new Vue({
    el: '#app',
    router,
    store,
    nprogress,
    template: '<App/>',
    components: { App }
});
