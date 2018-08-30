<template>
<vk-grid gutter="large">
    <!--Menu-->
    <!--<vk-sticky>-->
    <div class="uk-width-1-4@m">
        <h2>{{brandName}}</h2>
        <ul class="uk-iconnav">
            <li><vk-icon-link icon="arrow-left" @click="goBack()" title="Go back"></vk-icon-link></li>
            <li v-if="$route.name != 'BrandInfo'">
                <vk-icon-link icon="info"
                              @click="$router.push({ name:'BrandInfo' })"
                              title="Info"
                ></vk-icon-link>
            </li>
            <li v-if="$route.name != 'AllFB'">
                <vk-icon-link icon="comments"
                              @click="$router.push({ name: 'AllFB', params: { pageNumber: 1 }})"
                              title="Feedbacks"
                ></vk-icon-link>
            </li>
            <li v-if="$route.name != 'AddFB'">
                <vk-icon-link icon="plus-circle"
                              @click="$router.push({ name: 'AddFB' })"
                              title="Add feedback"
                ></vk-icon-link>
            </li>
        </ul>
    </div>
    <!--</vk-sticky>-->
    <!--Feedbackes-->
    <div class="uk-width-3-4@m">
        <!--Add feedback or Show all feedbacks section-->
        <router-view class="uk-margin-medium-bottom"></router-view>
    </div>
</vk-grid>
</template>

<script>
export default {
    name: 'BrandPage',

    data () {
        return {
            loading: false,
            error: null
        }
    },

    props: ['brandName'],

    created () {
        this.fetchData();
    },

    mounted () {},

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        fetchData () {
        },
        goBack () {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        }
    }
}
</script>
