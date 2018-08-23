/* router configuration */
import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'
import LoggedInCallback from './components/LoggedInCallback.vue'
import BrandPage from './components/BrandPage.vue'
import AddFB from './components/AddFB.vue'
import AllFB from './components/AllFB.vue'
import BrandInfo from './components/BrandInfo.vue'


// tell Vue to use the vue-router plugin
Vue.use(Router);

const router = new Router({
    mode: 'history',
    // base: __dirname,
    // scroll to the top when to route
    scrollBehavior (to, from, savedPosition) {
        return savedPosition ? savedPosition : { x: 0, y: 0 }
    },
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
                    path: 'info',
                    name: 'BrandInfo',
                    component: BrandInfo,
                    props: true
                },
                {
                    path: 'feedbacks/add',
                    name: 'AddFB',
                    component: AddFB,
                    props: true
                },
                {
                    path: 'feedbacks/:page_number',
                    name: 'AllFB',
                    component: AllFB,
                    props: true
                }
            ]
        },
        {
            path: '/logged-in/:provider',
            name: 'LoggedInCallback',
            component: LoggedInCallback,
            props: true
        },
    ]
});

export default router
