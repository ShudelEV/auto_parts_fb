<template>
<div v-if="loading">Loading...</div>
<div v-else-if="error && !loading">{{error}}</div>
<vk-grid v-else gutter="large">
    <!--BrandInfo window-->
    <router-view></router-view>
    <!--Menu-->
    <div class="uk-width-1-4@m">
        <vk-card>Menu</vk-card>
    </div>
    <!--Feedbackes-->
    <div class="uk-width-expand@m">
        <ul uk-accordion="multiple: true" class="uk-list uk-list-divider">
            <!--Feedback-->
            <li v-for="fb in feedbacks" :key="fb.id">
                <!--Header-->
                <a class="uk-accordion-title" href="#">
                    <vk-icon icon="cog"></vk-icon> {{ fb.part.type }}
                    <template v-if="fb.part.car" >
                        <vk-icon icon="cart" class="uk-margin-small-left"></vk-icon> {{ fb.part.car }}
                    </template>
                    <div class="uk-margin-medium-left uk-display-inline-block">
                        <vk-icon v-for="i in [1,2,3,4,5]" :key="i"
                             :class="i <= fb.stars ? 'uk-margin-small-right fill-star' : 'uk-margin-small-right'"
                             icon="star"
                        ></vk-icon>
                    </div>
                </a>
                <!--Content-->
                <div class="uk-accordion-content">
                    <article class="uk-comment">
                        <!--User information-->
                        <!--<header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>-->
                            <!--<div class="uk-width-auto">-->
                                <!--<img class="uk-comment-avatar"-->
                                     <!--src="/static/images/portrait-placeholder.jpg"-->
                                     <!--width="40" height="40" alt="">-->
                            <!--</div>-->
                            <!--<div class="uk-width-expand">-->
                                <!--<h4 class="uk-comment-title uk-margin-remove">-->
                                    <!--<a class="uk-link-reset" href="#">{{ fb.owner }}</a>-->
                                <!--</h4>-->
                                <!--<ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove">-->
                                    <!--<li><a href="#">All fb</a></li>-->
                                <!--</ul>-->
                            <!--</div>-->
                        <!--</header>-->
                        <!--Feedback text-->
                        <div class="uk-comment-body">
                            <p>{{ fb.description }}</p>
                        </div>
                        <!--Images-->
                        <div v-if="fb.images" class="uk-position-relative uk-visible-toggle uk-light" uk-slider>
                            <ul class="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m">
                                <li v-for="img in fb.images">
                                    <img :src="img" alt="">
                                </li>
                            </ul>
                            <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#"
                               uk-slidenav-previous uk-slider-item="previous"
                            ></a>
                            <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#"
                               uk-slidenav-next uk-slider-item="next"
                            ></a>
                        </div>
                        <div class="uk-comment-meta uk-margin-top">
                            {{ fb.owner }} &nbsp;&nbsp;&nbsp;&nbsp; Created: {{ (new Date(fb.created)).toLocaleString("ru") }}
                        </div>
                    </article>
                </div>
            </li>
        </ul>
    </div>
</vk-grid>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'BrandPage',

    data () {
        return {
            loading: false,
            error: null,
            brandName: '',
            feedbacks: []
        }
    },

    created () {
        this.fetchData();
        this.brandName = this.$route.params.name
    },

    watch: {
        '$route': 'fetchData'
    },

    computed: {
        ...mapState({
            brandItems: state => state.all.partBrands
        })
    },

    methods: {
        fetchData () {
            this.error = null;
            this.loading = true;
            this.$http.get('/api/feedbacks/' + this.$route.params.name + '/')
                .then(response => {
                    this.$store.commit('SET_BRAND_FEEDBACKS', {
                        name: this.$route.params.name,
                        items: response.data
                    });
                    this.feedbacks = response.data;
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false;
                    this.error = error.response.data
                })
        }
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
