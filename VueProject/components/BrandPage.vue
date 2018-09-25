<template>
<div class="uk-grid-large" uk-grid>
    <!--Menu-->
    <div class="uk-width-1-4@m">
        <div uk-sticky="top:#navbar; offset: 100" media="@m">
            <div>
                <div class="uk-card uk-card-default uk-card-small uk-card-body" :class="{'uk-margin-top': showOnUp()}">
                    <h2>{{ brandName }}</h2>
                    <ul class="uk-iconnav">
                        <li>
                            <a class="uk-icon-link" uk-icon="arrow-left"
                               @click="goBack()"
                               :title="$t('Go back')"
                            ></a>
                        </li>
                        <li v-if="$route.name != 'BrandInfo'">
                            <a class="uk-icon-link" uk-icon="info"
                                          @click="$router.push({ name:'BrandInfo' })"
                                          :title="$t('Info')"
                            ></a>
                        </li>
                        <li v-if="$route.name != 'AllBrandFB'">
                            <a class="uk-icon-link" uk-icon="list"
                                          @click="$router.push({name: 'AllBrandFB', params: {brandName: brandName}, query: {page: 1}})"
                                          :title="$t('Feedbacks')"
                            ></a>
                        </li>
                        <li v-if="$route.name != 'AddFB'">
                            <a class="uk-icon-link" uk-icon="plus-circle"
                                          @click="$router.push({name: 'AddFB', params: {brandName: brandName}})"
                                          :title="$t('Add feedback')"
                            ></a>
                        </li>
                    </ul>
                </div>
                <div v-show="$route.name==='AllBrandFB' && showSearch"
                     class="uk-card uk-card-default uk-card-small uk-card-body uk-background-muted uk-margin-top"
                     :class="{'disabled-content': $store.state.all.loading}"
                >
                    <search :brandName="brandName"></search>
                </div>
            </div>
        </div>
    </div>

    <!--Feedbackes-->
    <div class="uk-width-3-4@m uk-margin-remove-top">
        <!--Add feedback or Show all feedbacks section-->
        <router-view @showSearch="showSearch=true" class="uk-margin-medium-bottom"></router-view>
    </div>
</div>
</template>

<script>
import Search from './Search.vue'

export default {
    name: 'BrandPage',

    components: { Search, },

    data () {
        return {
            showSearch: false,
        }
    },

    props: ['brandName'],

    methods: {
        showOnUp () {
            return (window.innerWidth <= 960)
        },
        goBack () {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
    }
}
</script>
