<template>
<div>
    <!--Navbar-->
    <div class="uk-section uk-section-default uk-padding-remove-vertical">
        <!--Home page navbar-->
        <template v-if="$route.name == 'Home'">
            <img src="/static/images/header.jpeg" alt="" id="offset">
            <div class="uk-container uk-position-top">
                <vk-sticky bottom="#offset">
                    <nav-bar-login :logo="logo" @showLoginWindow="showLoginWindow=true"></nav-bar-login>
                </vk-sticky>
            </div>
        </template>
        <!--Other page navbar-->
        <template v-else>
            <vk-card uk-sticky>
                <div class="uk-container uk-position-top">
                    <nav-bar-login :logo="logo" @showLoginWindow="showLoginWindow=true"></nav-bar-login>
                </div>
            </vk-card>
        </template>
    </div>
    <!--Login Window-->
    <login-window :show="showLoginWindow" @close="showLoginWindow=false"></login-window>
    <!--Body-->
    <div class="uk-section uk-section-default uk-section-xsmall">
        <div class="uk-container">
            <router-view></router-view>
        </div>
    </div>
</div>
</template>

<script>
import NavBarLogin from './components/NavBarLogin.vue'
import LoginWindow from './components/Login.vue'

export default {
    name: 'App',

    components: { NavBarLogin, LoginWindow },

    data () {
        return {
            logo: 'PartsOK',
            showLoginWindow: false,
        }
    },

    created () {
        this.$http.get('/api/part-brands/').then(
            response => this.$store.commit('SET_PART_BRANDS', response.data)
        )
    },

    mounted () {
        let expires_at = JSON.parse(localStorage.getItem('expires_at'));
        if (new Date(expires_at) < new Date(Date.now())) {
            this.$emit('destroyToken')
        } else {
            // set axios default config
            this.$http.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('auth_token');
            this.$store.dispatch('getUser')
        }
    },
}
</script>
