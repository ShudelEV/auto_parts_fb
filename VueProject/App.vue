<template>
<div class="">
    <!--Error notification-->
    <vk-notification :messages.sync="messages"></vk-notification>
    <div :class="{'content-min-height': $route.name=='Home'}">
        <!--Load Progress Bar-->
        <nprogress-container></nprogress-container>
        <!--Navbar-->
        <div class="uk-section uk-section-default uk-padding-remove-vertical">
            <!--Home page navbar-->
            <template v-if="$route.name=='Home'">
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
                <div id="navbar" class="uk-card uk-card-default" uk-sticky>
                    <div class="uk-container bg-img">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </div>
                </div>
            </template>
        </div>
        <!--Login Window-->
        <login-window :show="$store.state.account.showLoginWindow"></login-window>
        <!--Body-->
        <!--<div class="" >-->
            <div class="uk-container bg-img">
                <router-view></router-view>
            </div>
        <!--</div>-->
    </div>
    <!--Footer-->
    <div class="uk-container bg-img">
        <div v-show="$route.name==='Home'">
            <footer class="uk-overlay-default uk-text-middle">
                © 2018
            </footer>
        </div>
        <div v-show="$route.name!=='Home'" class="uk-inline">
            <img src="/static/images/footer.png" alt="">
            <div class="uk-position-bottom uk-overlay uk-padding-small">
                <div> © 2018</div>
            </div>
        </div>
    </div>

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
    }
}
</script>

<style>
    .content-min-height {min-height: calc(100vh - 62px);}
    .uk-container.bg-img {
        background-size: contain;
        background-image: url(/static/images/bg.jpg);
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
