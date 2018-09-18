/* router configuration */
import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home.vue'
import LoggedInCallback from './components/LoggedInCallback.vue'
import FBList from './components/FBList.vue'
import PageNotFound from './components/PageNotFound.vue'
import Page404 from './components/Page404.vue'

const BrandPage = () => import(/* webpackChunkName: "BrandPage" */ './components/BrandPage.vue');
const AddFB = () => import(/* webpackChunkName: "BrandPage" */ './components/AddFB.vue');
const AllFB = () => import(/* webpackChunkName: "BrandPage" */ './components/AllFB.vue');
const BrandInfo = () => import(/* webpackChunkName: "BrandPage" */ './components/BrandInfo.vue');
// tell Vue to use the vue-router plugin
Vue.use(Router);

function getProps (route) {
    return {
        default: true,
        page: route.query.page ? Number(route.query.page) : 1,
        part_category: route.query.part_category ? route.query.part_category : null,
        part_type: route.query.part_type ? Number(route.query.part_type) : null,
        stars: route.query.stars ? JSON.parse(route.query.stars) : null
    }
}

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
        },
        {
            path: '/',
            name: 'All',
            component: AllFB,
            props: true,
            children: [
                {
                    path: 'feedbacks/',
                    name: 'AllFB',
                    component: FBList,
                    props: getProps
                }
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
                    path: 'feedbacks/',
                    name: 'AllBrandFB',
                    component: FBList,
                    props: getProps
                }
            ]
        },
        {
            path: '/logged-in/:provider',
            name: 'LoggedInCallback',
            component: LoggedInCallback,
            props: true
        },
        { path: "/404", component: Page404 },
        { path: "*", component: PageNotFound }
    ]
});

export default router
