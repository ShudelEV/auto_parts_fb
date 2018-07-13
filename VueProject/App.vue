<template>
<div>
    <!--Navbar-->
    <div class="uk-section uk-section-default uk-padding-remove-vertical">
        <!--Home page navbar-->
        <template v-if="$route.name == 'Home'">
            <img src="/static/images/header.jpeg" alt="" id="offset">
            <div class="uk-container uk-position-top">
                <vk-sticky :bottom="sticky">
                    <vk-navbar transparent>
                        <vk-navbar-nav>
                            <vk-navbar-logo>{{ logoHome }}</vk-navbar-logo>
                        </vk-navbar-nav>
                        <vk-navbar-nav slot="right">
                            <nav-bar-login></nav-bar-login>
                        </vk-navbar-nav>
                    </vk-navbar>
                </vk-sticky>
            </div>
        </template>
        <!--Other page navbar-->
        <template v-else>
            <vk-card uk-sticky>
                <div class="uk-container uk-position-top">
                    <vk-navbar transparent>
                        <vk-navbar-nav>
                            <vk-navbar-logo>{{ logo }}</vk-navbar-logo>
                        </vk-navbar-nav>
                        <vk-navbar-nav slot="right">
                            <nav-bar-login></nav-bar-login>
                        </vk-navbar-nav>
                    </vk-navbar>
                </div>
            </vk-card>
        </template>
    </div>
    <!--Login Window-->
    <login-window :show="showLoginWindow" @close="showLoginWindow=false"></login-window>
    <!--Body-->
    <div class="uk-section uk-section-default uk-section-xsmall">
        <div class="uk-container">
            <!--Home-->
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
            logoHome: 'PartsOK',
            logo: ''
        }
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
        if (this.$route.name == 'BrandFB') {
            this.logo = this.$route.params.name
        }
    },
}
</script>
