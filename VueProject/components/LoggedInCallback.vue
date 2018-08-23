<template>
</template>

<script>
export default {
    name: 'LoggedInCallback',

    props: ['provider'],

    mounted() {
        this.$store.dispatch('getTokenSocialAuth', { query: this.$route.query, provider: this.provider });
        this.$router.push('/');
    },
};
</script>
