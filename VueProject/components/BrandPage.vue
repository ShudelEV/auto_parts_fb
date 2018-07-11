<template>
<div v-if="loading">Loading...</div>
<div v-else-if="error && !loading">{{error}}</div>
<div v-else>
    <ul uk-accordion="multiple: true">
        <li v-for="fb in feedbacks" :key="fb.id">
            <a class="uk-accordion-title" href="#">{{fb.created}}</a>
            <div class="uk-accordion-content">
                {{fb.description}}
            </div>
        </li>
    </ul>
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
