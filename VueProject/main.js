import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store/index'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme'
import VueStars from './plugins/plugin'

import Cookies from 'js-cookie'

import App from './App.vue'

// default axios default configuration
const axios_conf = {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
    }
};

// wrapper for integrating axios to Vuejs
// usage: this.axios.get() or this.$http.get()
Vue.use(VueAxios, axios.create(axios_conf));

// tell Vue whether or not to show tips and warnings in the developer console of browser
Vue.config.productionTip = true;

//UIKit
Vue.use(Vuikit);
Vue.use(VuikitIcons);

//Stars
Vue.use(VueStars);

const app = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});
