<template>
<div>
    <!--Error notification-->
    <vk-notification :messages.sync="account.message"></vk-notification>
    <vk-notification :messages.sync="all.message"></vk-notification>
    <div class="content">
        <!--Load Progress Bar-->
    <!--<vk-sticky>-->
        <nprogress-container></nprogress-container>
    <!--</vk-sticky>-->
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
                <div class="uk-card uk-card-default" uk-sticky>
                    <div class="uk-container">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </div>
                </div>
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
    <!--Footer-->
    <footer>
        Footer
    </footer>
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
                this.$store.dispatch('getUser', { anonymous: false });
            // With social authorised user
            } else if (localStorage.getItem('jwt_token')) {
                // set axios default config
                this.$http.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('jwt_token');
                this.$store.dispatch('getUser', { anonymous: false });
            // Anonymous user
            } else if (localStorage.getItem('anonymous_user_auth_token')) {
                // set axios default config
                this.$http.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('anonymous_user_auth_token');
                this.$store.dispatch('getUser', { anonymous: true });
            }
        }
    },

    computed: mapState({
        account: state => state.account,
        all: state => state.all
    })
}
</script>

<style>
    .content {
        min-height: calc(100vh - 50px);
    }
    footer {
        background-color: lightgray;
        height: 50px;
    }
    /*Show progress bar*/
    .nprogress-custom-parent {
        overflow: visible !important;
    }
    .nprogress-custom-parent #nprogress .spinner,
    .nprogress-custom-parent #nprogress .bar {
        position: fixed !important;
    }
</style>
