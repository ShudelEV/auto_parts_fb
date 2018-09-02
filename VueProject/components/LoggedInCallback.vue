<template>
</template>

<script>
export default {
    name: 'LoggedInCallback',

    props: ['provider'],

    mounted() {
        this.$store.dispatch('getTokenSocialAuth', { query: this.$route.query, provider: this.provider });
        const redirectUrl = sessionStorage.getItem('social_redirect_url');
        redirectUrl ? this.$router.push(redirectUrl) : this.$router.push('/')
    },
};
</script>
