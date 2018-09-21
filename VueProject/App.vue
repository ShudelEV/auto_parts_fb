<template>
<div class="">
    <!--Error notification-->
    <vk-notification :messages.sync="messages"></vk-notification>
    <div :style="{'min-height': $store.state.all.pageMinHeight + 'px'}">
        <!--Load Progress Bar-->
        <nprogress-container id="nprogress-container"></nprogress-container>
        <!--Navbar-->
        <div id="header" class="uk-section uk-section-default uk-padding-remove-vertical">
            <!--Home page navbar-->
            <div v-show="$route.name=='Home'">
                <div class="uk-card uk-hidden@m">
                    <div class="uk-container">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </div>
                </div>
                <img id="header_image" src="/static/images/header.jpeg" alt=""
                     class="uk-align-center uk-margin-remove-top uk-margin-remove-bottom"
                     @load="$store.commit('SET_ELEMENTS_HEIGHT'); $store.state.all.showSearch=true"
                >
                <div class="uk-container uk-position-top uk-visible@m">
                    <!--<div uk-sticky="bottom: #header_image; animation: uk-animation-slide-top">-->
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    <!--</div>-->
                </div>
            </div>
            <!--Other page navbar-->
            <div v-show="$route.name!=='Home'">
                <div id="navbar" class="uk-card uk-card-default" uk-sticky>
                    <div class="uk-container bg-img">
                        <nav-bar-login :logo="logo"></nav-bar-login>
                    </div>
                </div>
            </div>
        </div>
        <!--Login Window-->
        <login-window :show="$store.state.account.showLoginWindow"></login-window>
        <!--Edit Account-->
        <!--<edit-account :show="$store.state.account.showEditUsername || $store.state.account.showEditPassword"></edit-account>-->
        <!--Body-->
        <div class="uk-container bg-img" :style="{'min-height': $store.state.all.contentMinHeight + 'px'}">
            <router-view></router-view>
        </div>
    </div>
    <!--Footer-->
    <div id="footer" class="uk-container bg-img">
        <div :class="{'uk-inline': $route.name!=='Home'}">
            <img v-show="$route.name!=='Home'" @load="$store.commit('SET_ELEMENTS_HEIGHT')" src="/static/images/footer.png" alt="">
            <div class="uk-padding-small" :class="{'uk-position-bottom uk-overlay': $route.name!=='Home', 'uk-overlay-default': $route.name=='Home'}">
                <div uk-grid>
                    <div class="uk-flex-first"> © 2018</div>
                    <div>
                        <ul class="uk-subnav uk-subnav-divider">
                            <li><a type="text" :class="{'disabled-content': $i18n.locale()=='ru'}"
                                            @click="changeI18n('ru')"
                                            title="Русская версия"
                            >RU</a></li>
                            <li><a type="text" :class="{'disabled-content': $i18n.locale()=='en'}"
                               @click="changeI18n('en')"
                               title="English version"
                            >EN</a></li>
                        </ul>
                    </div>
                    <div class="uk-width-expand"></div>
                    <div><a href="#" uk-totop uk-scroll></a></div>
                </div>
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
    },

    methods: {
        changeI18n(lang) {
            this.$i18n.set(lang);
            this.axios.defaults.headers.common['Accept-Language'] = lang;
            this.$http.get('/api/part-types/').then(
                response => this.$store.commit('SET_PART_TYPES', response.data)
            );
        }
    }
}
</script>

<style>
    .uk-container.bg-img {
        background-size: contain;
        background-image: url(/static/images/bg.jpg);
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
