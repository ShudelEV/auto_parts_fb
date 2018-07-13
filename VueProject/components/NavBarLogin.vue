<template>
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
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'NavBarLogin',

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
        },
        gotoBrandInfo () {
            this.$router.push({name: 'BrandInfo', params: { name: this.$route.params.name }})
        }
    }
}
</script>
