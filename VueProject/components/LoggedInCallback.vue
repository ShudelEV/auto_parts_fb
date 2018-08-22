<template>
</template>

<script>
export default {
    name: 'LoggedInCallback',

    mounted() {
        console.log(this.$route.query);
        this.$http.post('/auth/o/google-oauth2/?state=' + this.$route.query.state + '&code=' + this.$route.query.code, this.$route.query).then(
            response => {
                console.log(response);
                window.location.href = '/'
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
};
</script>
