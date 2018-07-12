<template>
<div v-if="loading">Loading...</div>
<div v-else-if="error && !loading">{{error}}</div>
<div v-else>
    <vk-grid gutter="large">
        <div class="uk-width-1-4@m">
            <vk-card>Menu</vk-card>
        </div>
        <div class="uk-width-expand@m">
            <ul uk-accordion="multiple: true" class="uk-list uk-list-divider">
                <li v-for="fb in feedbacks" :key="fb.id">
                    <!--Feedback-->
                    <a class="uk-accordion-title" href="#">
                        {{ fb.part.type }} {{ fb.part.car ? fb.part.car : '' }} stars: {{ fb.stars }}
                    </a>
                    <div class="uk-accordion-content">
                        <article class="uk-comment">
                            <!--Header with user information-->
                            <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
                                <div class="uk-width-auto">
                                    <img class="uk-comment-avatar"
                                         src="/static/images/portrait-placeholder.jpg"
                                         width="40" height="40" alt="">
                                </div>
                                <div class="uk-width-expand">
                                    <h4 class="uk-comment-title uk-margin-remove">
                                        <a class="uk-link-reset" href="#">{{ fb.owner }}</a>
                                    </h4>
                                    <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove">
                                        <li v-if="fb.car">{{ fb.car }}</li>
                                        <li><a href="#">All fb</a></li>
                                    </ul>
                                </div>
                            </header>
                            <!--Feedback text-->
                            <div class="uk-comment-body">
                                <p>{{ fb.description }}</p>
                            </div>
                            <div class="uk-comment-meta uk-margin-top">
                                Created: {{ fb.created }}
                            </div>
                        </article>
                    </div>
                </li>
            </ul>
            </div>
    </vk-grid>
</div>
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
