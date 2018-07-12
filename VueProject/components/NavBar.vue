<template>
<div class="uk-container uk-position-top">
    <login-window :show="showLoginWindow" @close="showLoginWindow=false"></login-window>
    <vk-sticky :bottom="sticky">
        <vk-navbar transparent>
            <vk-navbar-nav>
                <vk-navbar-logo>{{ logo }}</vk-navbar-logo>
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
</template>

<script>
import { mapState } from 'vuex'
import LoginWindow from './Login.vue'

export default {
    name: 'App',

    components: { LoginWindow },

    data () {
        return {
            showLoginWindow: false
        }
    },

    props: ['logo', 'sticky'],

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
