/* router configuration */
import Vue from 'vue'
import Router from 'vue-router'

import Home from './pages/Home.vue'
import Login from './pages/Login.vue'

// tell Vue to use the vue-router plugin
Vue.use(Router);

export default new Router({
    mode: 'history',
    // base: __dirname,
    routes: [
        // {
            // path: '/',
            // name: 'Home',
            // component: Home,
            // children: [
            // ]
        // },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            // props: dynamicPropsFnOrder,
        },
    ]
})
