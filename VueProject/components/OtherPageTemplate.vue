<template>
    <div :style="{'min-height': $store.state.all.pageMinHeight + 'px'}">
        <!--Navbar-->
        <div id="header" class="uk-section uk-section-default uk-padding-remove-vertical">
            <div id="navbar" class="uk-card uk-card-default" uk-sticky>
                <div class="uk-container bg-img">
                    <nav-bar-login :logo="logo"></nav-bar-login>
                </div>
            </div>
        </div>
        <!--Edit Account-->
        <!--<edit-account :show="$store.state.account.showEditUsername || $store.state.account.showEditPassword"></edit-account>-->
        <!--Body-->
        <div class="uk-container bg-img" :style="{'min-height': $store.state.all.contentMinHeight + 'px'}">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import NavBarLogin from './NavBarLogin.vue'

export default {
    name: 'PageTemplate',

    components: { NavBarLogin, },

    mounted () {
        this.$nextTick(() => { this.$store.commit('SET_ELEMENTS_HEIGHT') })
    },

    data () {
        return {
            logo: 'PartsOK',
        }
    }
}
</script>
