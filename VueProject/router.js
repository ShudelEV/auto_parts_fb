/* router configuration */
import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'
import BrandPage from './components/BrandPage.vue'
import BrandInfo from './components/BrandInfo.vue'

// tell Vue to use the vue-router plugin
Vue.use(Router);

export default new Router({
    mode: 'history',
    // base: __dirname,
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            children: [
                {
                    path: 'brand/:name',
                    name: 'Brand',
                    component: BrandPage,
                    children: [
                        {
                            path: 'feedbacks',
                            name: 'BrandFB',
                            component: BrandPage
                        },
                        {
                            path: 'info',
                            name: 'BrandInfo',
                            component: BrandInfo
                        }
                    ]
                }
            ]
        }
    ]
})
