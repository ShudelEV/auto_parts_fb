/* router configuration */
import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'
import BrandPage from './components/BrandPage.vue'
import AddFB from './components/AddFB.vue'
import AllFB from './components/AllFB.vue'

// tell Vue to use the vue-router plugin
Vue.use(Router);

const router = new Router({
    mode: 'history',
    // base: __dirname,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
            ]
        },
        {
            path: '/brand/:brandName',
            name: 'Brand',
            component: BrandPage,
            props: true,
            children: [
                {
                    path: 'feedbacks/add',
                    name: 'AddFB',
                    component: AddFB
                },
                {
                    path: 'feedbacks/:page_number',
                    name: 'AllFB',
                    component: AllFB,
                    props: true
                }
            ]
        }
    ]
});

export default router
