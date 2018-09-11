<template>
    <article class="uk-comment uk-margin-top">
        <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
                <img class="uk-comment-avatar uk-border-rounded"
                     :src="brand.image" width="160" height="160" alt=""
                >
            </div>
            <div v-show="!loading"  class="uk-width-expand">
                <ul class="uk-subnav uk-subnav-divider uk-margin-remove">
                    <li style="text-transform:uppercase">{{ 'Country' | translate }}</li>
                    <li>{{brand.country}}</li>
                </ul>
                <ul class="uk-subnav uk-subnav-divider uk-margin-remove">
                    <li style="text-transform:uppercase">{{ 'Specialization' | translate }}</li>
                    <li>{{brand.specialization}}</li>
                </ul>
                <ul class="uk-subnav uk-subnav-divider uk-margin-remove">
                    <li style="text-transform:uppercase">{{ 'Site' | translate }}</li>
                    <li><a :href="brand.site_url" target="_blank">{{brand.site_url}}</a></li>
                </ul>
            </div>
        </header>
        <div class="uk-comment-body">
            <span v-html="brand.description"></span>
        </div>
    </article>
</template>

<script>
import { COUNTRIES } from '../data'

export default {
    name: 'BrandInfo',

    data () {
        return {
            loading: true,
            brand: {
                image: '',
                country: '',
                specialization: '',
                site_url: '',
                description: ''
            }
        }
    },

    props: ['brandName'],

    created () {
        if (this.brandInfo) {
            this.fetchData(this.brandInfo.id)
        }
    },

    mounted () {
        this.$store.commit('SET_ELEMENTS_HEIGHT')
    },

    computed: {
        brandInfo () {
            return this.$store.getters.getPartBrand(this.brandName)
        }
    },

    watch: {
        // the case when page is reloaded (F5)
        brandInfo: function (val) {
            this.fetchData(val.id)
        }
    },

    methods: {
        fetchData (id) {
            this.$http.get('/api/part-brands/' + id + '/').then(
                response => {
                    this.brand.description = response.data.description
            });
            this.brand.image = this.brandInfo.image;
            this.brand.country = COUNTRIES[this.brandInfo.country];
            this.brand.specialization = this.brandInfo.specialization;
            this.brand.site_url = this.brandInfo.site_url;
            this.loading = false
        },
    }
}
</script>
