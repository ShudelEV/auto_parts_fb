import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store/index'
import vuexI18n from 'vuex-i18n';
import en from './i18n/en.json';
import ru from './i18n/ru.json';
import VueStars from './plugins/plugin'
import NProgress from 'vue-nprogress'
import Cookies from 'js-cookie'
import App from './App.vue'

// Default axios default configuration
const axios_conf = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300 || status === 500;
    },
};
const Axios = axios.create(axios_conf);
// Add a response interceptor
const responseInterceptor = Axios.interceptors.response.use(
    function (response) {
        if (response.status === 500) {
            alert(response.statusText);
            document.location.reload();
        } else {
            return response;
        }
    },
    function (error) {
        return Promise.reject(error);
    });
// Wrapper for integrating axios to Vuejs
// usage: this.axios.get() or this.$http.get()
Vue.use(VueAxios, Axios);
// Tell Vue whether or not to show tips and warnings in the developer console of browser
Vue.config.productionTip = true;

// initialize the internationalization plugin on the vue instance.
// this.$i18n.set, this.$t and on the vue instance Vue.i18n.set
// default {moduleName: 'i18n'}
Vue.use(vuexI18n.plugin, store);
// add translations directly to the application
Vue.i18n.add('en', en);
Vue.i18n.add('ru', ru);
// set the start locale to use
Vue.i18n.set('ru');

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
