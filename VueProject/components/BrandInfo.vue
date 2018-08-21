<template>
    <article class="uk-comment">
        <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
                <img class="uk-comment-avatar" :src="brand.image" width="160" height="160" alt="">
            </div>
            <div class="uk-width-expand">
                <ul class="uk-subnav uk-subnav-divider uk-margin-remove">
                    <li style="text-transform:uppercase">Country</li>
                    <li>{{brand.country}}</li>
                </ul>
                <ul class="uk-subnav uk-subnav-divider uk-margin-remove">
                    <li style="text-transform:uppercase">Specialization</li>
                    <li>{{brand.specialization}}</li>
                </ul>
                <ul class="uk-subnav uk-subnav-divider uk-margin-remove">
                    <li style="text-transform:uppercase">Link</li>
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
export default {
    name: 'BrandInfo',

    data () {
        return {
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
            this.brand.country = this.brandInfo.country;
            this.brand.specialization = this.brandInfo.specialization;
            this.brand.site_url = this.brandInfo.site_url
        }
    }
}
</script>
