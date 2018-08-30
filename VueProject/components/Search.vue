<template>
<form class="uk-form-stacked">
    <fieldset class="uk-fieldset">
        <legend class="uk-legend">Search</legend>
        <!--Search by Part category or Part type-->
        <div class="uk-margin">
            <label class="uk-form-label" for="part">Part</label>
            <div class="uk-form-controls">
                <select id="part" v-model="part" name="part" class="uk-select" autofocus>
                    <option :value="''">&emsp;All parts</option>
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
        <!--Part type-->
        <!--<div class="uk-margin">-->
            <!--<label class="uk-form-label" for="part_type">Part type</label>-->
            <!--<select :disabled="!part_category" v-model="part_type" id="part_type" name="part_type" class="uk-select">-->
                <!--<option v-for="partType in part_category ? partTypes[partCategories[part_category]] : []"-->
                        <!--:key="partType.id"-->
                        <!--:value="partType.id"-->
                <!--&gt; {{ partType.name }} </option>-->
            <!--</select>-->
        <!--</div>-->
    </fieldset>
</form>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'Search',

    props: ['brandName'],

    data () {
        return {
            brand: this.brandName,
            part: '',
        }
    },

    watch: {
        part: function (val) {
            const name = this.brandName ? 'AllFB' : 'AllFBHome';
            let filter = {};
            if (this.part) {
                if (this.partCategories[this.part]) {
                    filter.part_category = this.part
                } else {
                    filter.part_type = this.part
                }
            }
            this.$store.dispatch('getFB', {
                filter,
                brandName: this.brandName,
                pageNumber: 1
            });
            this.$router.push({ name, params: { pageNumber: 1 }})
        }
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
}
</script>
