<template>
    <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
        <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo uk-link-reset" @click="$router.push({ name: 'Home' })">{{ logo }}</a>
        </div>
        <div class="uk-navbar-right">
            <!--Register/Login bar-->
            <div class="uk-navbar-item" v-if="!account.isAuthenticated || account.isAnonymous">
                <button class="uk-button uk-button-default uk-button-small" uk-toggle="target: #modal-login">{{ 'login' | translate }}</button>
            </div>
            <!--Account bar-->
            <div class="uk-navbar-item" v-else>
                <ul class="uk-iconnav">
                    <li><a uk-icon="icon: user" :title="account.name"></a></li>
                    <!--<vk-iconnav-item icon="file-edit" :title="$t('Edit account')"></vk-iconnav-item>-->
                    <!--<vk-dropdown class="uk-padding-small">-->
                        <!--<vk-nav-dropdown>-->
                            <!--<vk-nav-item-header :title="account.name" active></vk-nav-item-header>-->
                            <!--<vk-nav-item-divider></vk-nav-item-divider>-->
                            <!--<vk-nav-item :title="$t('Change username')" @click="$store.state.account.showEditUsername=true"></vk-nav-item>-->
                            <!--<vk-nav-item :title="$t('Change password')"></vk-nav-item>-->
                        <!--</vk-nav-dropdown>-->
                    <!--</vk-dropdown>-->
                    <li><a uk-icon="icon: sign-out" @click="logout()" :title="$t('Sign out')"></a></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'NavBarLogin',

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
