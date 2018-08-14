<template>
<div>
    <!--Load Progress Bar-->
    <nprogress-container style="height: 3px"></nprogress-container>
    <!--Error notification-->
    <vk-notification :messages.sync="account.message"></vk-notification>
    <vk-notification :messages.sync="all.message"></vk-notification>
    <!--Navbar-->
    <div class="uk-section uk-section-default uk-padding-remove-vertical">
        <!--Home page navbar-->
        <template v-if="$route.name == 'Home'">
            <img src="/static/images/header.jpeg" alt="" id="offset">
            <div class="uk-container uk-position-top">
                <vk-sticky bottom="#offset">
                    <nav-bar-login :logo="logo"></nav-bar-login>
                </vk-sticky>
            </div>
        </template>
        <!--Other page navbar-->
        <template v-else>
            <vk-card uk-sticky>
                <div class="uk-container uk-position-top">
                    <nav-bar-login :logo="logo"></nav-bar-login>
                </div>
            </vk-card>
        </template>
    </div>
    <!--Login Window-->
    <login-window :show="account.showLoginWindow"></login-window>
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
import { mapState } from 'vuex'
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'

export default {
    name: 'App',

    components: { NavBarLogin, LoginWindow, NprogressContainer },

    data () {
        return {
            logo: 'PartsOK'
        }
    },

    created () {
        this.$http.get('/api/part-brands/').then(
            response => this.$store.commit('SET_PART_BRANDS', response.data)
        )
    },

    mounted () {
        if (localStorage.getItem('expires_at')) {
            let expires_at = JSON.parse(localStorage.getItem('expires_at'));
            // Session is expired
            if (new Date(expires_at) < new Date(Date.now())) {
                this.$emit('destroyToken');
            // Authorised user
            } else if (localStorage.getItem('auth_token')) {
                // set axios default config
                this.$http.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('auth_token');
                this.$store.dispatch('getUser');
            // Anonymous user
            } else if (localStorage.getItem('anonymous_user_auth_token')) {
                // set axios default config
                this.$http.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('anonymous_user_auth_token');
                this.$store.state.account.isAnonymous = true;
                this.$store.state.account.isAuthenticated = true
            }
        }
    },

    computed: mapState({
        account: state => state.account,
        all: state => state.all,
    })
}
</script>
