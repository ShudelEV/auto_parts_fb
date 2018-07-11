/* router configuration */
import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'
import BrandPage from './components/BrandPage.vue'

// tell Vue to use the vue-router plugin
Vue.use(Router);

export default new Router({
    mode: 'history',
    // base: __dirname,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/brand/:name/feedbacks',
            name: 'Brand',
            component: BrandPage,
            children: [
            ]
        },
    ]
})
