<template>
<form class="uk-form-stacked">
    <fieldset class="uk-fieldset">
        <!--Search by Part category or Part type-->
        <div class="uk-margin">
            <div class="uk-form-controls">
                <select id="part" v-model="part" name="part" class="uk-select" autofocus>
                    <option :value="''">&emsp;{{ $t('All parts') }}</option>
                    <template v-for="(value, key) in partCategories">
                        <option style="color: darkgray"
                                :value="key"
                        >{{ value }}</option>
                        <option v-for="partType in partTypes[value]"
                                :key="partType.id"
                                :value="partType.id"
                        > &emsp;{{ partType.name }} </option>
                    </template>
                </select>
            </div>
        </div>
        <div class="uk-margin-top uk-grid-small uk-child-width-auto uk-grid">
            <label for="bad"><input class="uk-radio" id="bad" value="bad" type="radio" v-model="stars">
                <span class="uk-text-small">{{ $t('bad') }}</span>
            </label>
            <label for="nbad"><input class="uk-radio" id="nbad" value="nbad" type="radio" v-model="stars">
                <span class="uk-text-small">{{ $t('not bad') }}</span>
            </label>
            <label for="good"><input class="uk-radio" id="good" value="good" type="radio" v-model="stars">
                <span class="uk-text-small">{{ $t('good') }}</span>
            </label>
        </div>
    </fieldset>
</form>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'Search',

    props: ['brandName'],

    data () {
        // if page is updated, get values from query
        const q = this.$route.query;
        return {
            brand: this.brandName,
            part: q.part_category ? q.part_category : (Number(q.part_type) ? Number(q.part_type) : ''),
            stars: q.stars ? (q.stars === JSON.stringify([1]) ? 'bad' : (q.stars === JSON.stringify([2, 3]) ? 'nbad' : 'good')) : null,
        }
    },

    created () { },

    watch: {
        part: function (val) { this.fetchData() },
        stars: function (val) { this.fetchData() },
    },

    computed: {
        ...mapState({
            partCategories: state => state.all.partCategories,
//            carBrands: state => state.all.carBrands,
//            carModels: state => state.all.carModels,
        }),
        ...mapGetters({
            partTypes: 'getPartTypes',
//            getCarModels: 'getCarModels',
        })
    },

    methods: {
        fetchData () {
            const name = this.brandName ? 'AllBrandFB' : 'AllFB';
            const query = { page: 1 };
            if (this.part) {
                if (this.partCategories[this.part]) {
                    query.part_category = this.part
                } else {
                    query.part_type = this.part
                }
            }
            if (this.stars) {
                const stars = this.stars === 'bad' ? [1] : (this.stars === 'nbad' ? [2, 3] : [4, 5]);
                query.stars = JSON.stringify(stars)
            }
            this.$router.push({ name, params: { brandName: this.brandName }, query })
        }
    }
}
</script>
