<template>
<div>
    <!--Error notification-->
    <vk-notification :messages.sync="messages"></vk-notification>
    <!--<vk-notification :messages.sync="all.message"></vk-notification>-->
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
        <login-window :show="$store.state.account.showLoginWindow"></login-window>
        <!--Body-->
        <div class="uk-section uk-section-default uk-section-xsmall">
            <div class="uk-container">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <!--Footer-->
    <footer>
         <vk-card padding="small" class="uk-background-muted">
             Footer
         </vk-card>
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
            logo: 'PartsOK',
            messages: []
        }
    },

    created () {
        this.$http.get('/api/part-brands/').then(
            response => { this.$store.commit('SET_PART_BRANDS', response.data) }
        );
        this.$http.get('/api/part-types/').then(
            response => this.$store.commit('SET_PART_TYPES', response.data)
        );
        this.$store.dispatch('getUser')
    },

    computed: mapState({
        accountMessage: state => state.account.message,
        allMessage: state => state.all.message
    }),

    watch: {
        accountMessage: function (val) {
            if (val) { this.messages.push(val) }
        },
        allMessage: function (val) {
            if (val) { this.messages.push(val) }
        }
    }
}
</script>

<style>
    .content {
        min-height: calc(100vh - 62px);
    }
    footer {
        min-height: 50px;
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
