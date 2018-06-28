import Vue from 'vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import '@vuikit/theme'

import App from './App.vue'

// tell Vue whether or not to show tips and warnings in the developer console of browser
Vue.config.productionTip = true;
//UIKit
Vue.use(Vuikit);
Vue.use(VuikitIcons);

// wrapper for integrating axios to Vuejs
// usage: this.axios.get() or this.$http.get()
Vue.use(VueAxios, axios);

const app = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});