<template>
<div>
    <!--Navbar-->
    <div v-if="$route.name == 'Home'" class="uk-section uk-section-default uk-padding-remove-vertical">
        <img src="/static/images/header.jpeg" alt="" id="offset">
        <nav-bar :logo="logoHome" :sticky="'#offset'"></nav-bar>
    </div>
    <div v-else class="uk-section uk-section-default uk-padding-remove-vertical">
        <vk-card uk-sticky>
            <nav-bar :logo="logo"></nav-bar>
        </vk-card>
    </div>
    <!--Body-->
    <div class="uk-section uk-section-default uk-section-xsmall">
        <div class="uk-container">
            <router-view @setLogo="a => logo = a"></router-view>
        </div>
    </div>
</div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
    name: 'App',

    components: { NavBar },

    data () {
        return {
            logoHome: 'PartsOK',
            logo: ''
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
}
</script>
