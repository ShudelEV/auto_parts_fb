<template>
<vk-grid gutter="large">
    <!--Menu-->
    <div class="uk-width-1-4@m">
        <vk-sticky top="#navbar" :offset="100" media="@m">
            <div>
                <vk-card :class="{'uk-margin-top': showOnUp()}" padding="small">
                    <h2>{{brandName}}</h2>
                    <ul class="uk-iconnav">
                        <li><vk-icon-link icon="arrow-left" @click="goBack()" :title="$t('Go back')"></vk-icon-link></li>
                        <li v-if="$route.name != 'BrandInfo'">
                            <vk-icon-link icon="info"
                                          @click="$router.push({ name:'BrandInfo' })"
                                          :title="$t('Info')"
                            ></vk-icon-link>
                        </li>
                        <li v-if="$route.name != 'AllBrandFB'">
                            <vk-icon-link icon="list"
                                          @click="$router.push({name: 'AllBrandFB', params: {brandName: brandName}, query: {page: 1}})"
                                          :title="$t('Feedbacks')"
                            ></vk-icon-link>
                        </li>
                        <li v-if="$route.name != 'AddFB'">
                            <vk-icon-link icon="plus-circle"
                                          @click="$router.push({name: 'AddFB', params: {brandName: brandName}})"
                                          :title="$t('Add feedback')"
                            ></vk-icon-link>
                        </li>
                    </ul>
                </vk-card>
                <vk-card padding="small" class="uk-background-muted uk-margin-top">
                    <search v-if="$route.name==='AllBrandFB'" :brandName="brandName"></search>
                </vk-card>
            </div>
        </vk-sticky>
    </div>

    <!--Feedbackes-->
    <div class="uk-width-3-4@m uk-margin-remove-top">
        <!--Add feedback or Show all feedbacks section-->
        <router-view class="uk-margin-medium-bottom"></router-view>
    </div>
</vk-grid>
</template>

<script>
import Search from './Search.vue'

export default {
    name: 'BrandPage',

    components: { Search, },

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
        showOnUp () {
//            console.log(window.innerWidth <= 800 && window.innerHeight <= 600)
            return (window.innerWidth <= 960)
        },
        goBack () {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        }
    }
}
</script>
