<template>
    <div class="uk-text-center uk-text-large uk-text-bold uk-padding">
        {{ 'Error' | translate }} 404. {{ 'Page not found' | translate }}
    </div>
</template>
<script>
export default {
    name: "Page404",

    mounted () {
        this.$nextTick(() => { this.$store.commit('SET_ELEMENTS_HEIGHT') })
    }
}
</script>
