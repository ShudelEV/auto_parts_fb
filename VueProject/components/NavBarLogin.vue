<template>
    <vk-navbar transparent>
        <vk-navbar-nav>
            <vk-navbar-logo>
                <a class="uk-link-reset" @click="$router.push({ name: 'Home' })">{{ logo }}</a>
            </vk-navbar-logo>
        </vk-navbar-nav>
        <vk-navbar-nav slot="right">
            <!--Register/Login bar-->
            <vk-navbar-item v-if="!account.isAuthenticated || account.isAnonymous">
                <vk-button class="uk-button-small" @click="account.showLoginWindow = true">{{ 'login' | translate }}</vk-button>
            </vk-navbar-item>
            <!--Account bar-->
            <vk-navbar-item v-else>
                <vk-iconnav>
                    <vk-iconnav-item icon="user" :title="account.name"></vk-iconnav-item>
                    <!--<vk-iconnav-item icon="file-edit" :title="$t('Edit account')"></vk-iconnav-item>-->
                    <!--<vk-dropdown class="uk-padding-small">-->
                        <!--<vk-nav-dropdown>-->
                            <!--<vk-nav-item-header :title="account.name" active></vk-nav-item-header>-->
                            <!--<vk-nav-item-divider></vk-nav-item-divider>-->
                            <!--<vk-nav-item :title="$t('Change username')" @click="$store.state.account.showEditUsername=true"></vk-nav-item>-->
                            <!--<vk-nav-item :title="$t('Change password')"></vk-nav-item>-->
                        <!--</vk-nav-dropdown>-->
                    <!--</vk-dropdown>-->
                    <vk-iconnav-item @click="logout()" icon="sign-out" :title="$t('Sign out')"></vk-iconnav-item>
                </vk-iconnav>
            </vk-navbar-item>
        </vk-navbar-nav>
    </vk-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'NavBarLogin',

    data () {
        return {
        }
    },

    props: ['logo'],

    computed: {
        ...mapState({
            account: state => state.account
        })
    },


    methods: {
        logout () {
            this.$store.commit('REMOVE_SESSION')
        }
    }
}
</script>
