<template>
<div>
    <div class="uk-position-relative">
        <img v-if="$route.path == '/'" src="/static/images/header.jpeg" alt="" id="offset">
        <div class="uk-container uk-position-top">
            <login-window :show="showLoginWindow" @close="showLoginWindow=false"></login-window>
            <vk-sticky bottom="#offset">
                <vk-navbar transparent class="uk-navbar-sticky">
                    <vk-navbar-nav>
                        <vk-navbar-logo>PartsOK</vk-navbar-logo>
                    </vk-navbar-nav>
                    <vk-navbar-nav slot="right">
                        <!--Register/Login bar-->
                        <vk-navbar-item v-if="!account.isAuthenticated">
                            <vk-button class="uk-button-small" @click="showLoginWindow=true">Login</vk-button>
                        </vk-navbar-item>
                        <!--Account bar-->
                        <vk-navbar-item v-else>
                            <ul class="uk-iconnav">
                                <li><vk-icon icon="user" :title="account.name"></vk-icon></li>
                                <li><vk-icon-link href="#" icon="file-edit" title="Edit account"></vk-icon-link></li>
                                <li><vk-icon-link @click="logout()" icon="sign-out" title="Sing out"></vk-icon-link></li>
                            </ul>
                        </vk-navbar-item>
                    </vk-navbar-nav>
                </vk-navbar>
            </vk-sticky>
        </div>
    </div>
    <div class="uk-section uk-section-default uk-section-xsmall">
        <div class="uk-container">
            <!--component Home.vue-->
            <router-view></router-view>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import LoginWindow from './components/Login.vue'

export default {
    name: 'App',

    components: { LoginWindow },

    data () {
        return {
            showLoginWindow: false
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
    },

    computed: {
        ...mapState({
            account: state => state.account
        })

    },

    methods: {
        logout () {
            this.$store.dispatch('destroyToken')
        }
    }
}
</script>
