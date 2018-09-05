<template>
<div class="">
    <!--Error notification-->
    <vk-notification :messages.sync="messages"></vk-notification>
    <div class="content uk-background-contain" style="background-image: url(/static/images/bg.jpg); background-repeat: repeat-y;">
        <!--Load Progress Bar-->
        <nprogress-container></nprogress-container>
        <!--Navbar-->
        <div class="uk-section uk-section-default uk-padding-remove-vertical">
            <!--Home page navbar-->
            <template v-if="$route.name == 'Home'">
                <div class="uk-card uk-hidden@m">
                    <div class="uk-container">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </div>
                </div>
                <img id="header_image" src="/static/images/header.jpeg" alt="" class="uk-align-center uk-margin-remove-top uk-margin-remove-bottom">
                <div class="uk-container uk-position-top uk-visible@m">
                    <vk-sticky bottom="#header_image" animation="slide-top" @active="">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </vk-sticky>
                </div>
            </template>
            <!--Other page navbar-->
            <template v-else>
                <div id="navbar" class="uk-card uk-card-default uk-margin-bottom" uk-sticky>
                    <div class="uk-container">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </div>
                </div>
            </template>
        </div>
        <!--Login Window-->
        <login-window :show="$store.state.account.showLoginWindow"></login-window>
        <!--Body-->
        <!--<div class="" >-->
            <div class="uk-container">
                <router-view></router-view>
            </div>
        <!--</div>-->
    </div>
    <!--Footer-->
    <footer>
         <vk-card padding="small" class="uk-background-muted">
             <div class="uk-container">Footer</div>
         </vk-card>
    </footer>
</div>
</template>

<script>
import { mapState } from 'vuex'
import NavBarLogin from './components/NavBarLogin.vue'
import LoginWindow from './components/Login.vue'
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
    },

    methods: {
        showOnUp () {
            console.log(window.innerWidth <= 800 && window.innerHeight <= 600)
            return (window.innerWidth <= 800 && window.innerHeight <= 600)
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
    .disabled-content {
        opacity: .5;
        pointer-events: none;
    }
</style>
