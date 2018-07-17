<template>
<div>
    <form class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1">
            <h2>Add Your Feedback</h2>
        </div>
        <div class="uk-width-1-2@s">
            <label class="uk-form-label" for="part"> *Part</label>
            <select id="part" class="uk-select" autofocus>
                <option></option>
                <option :value="-1">&emsp;Add..</option>
                <template v-for="(value, key) in partTypes">
                    <option disabled style="color: darkgray">{{ key }}</option>
                    <option v-for="partType in value"
                            :key="partType.id"
                            :value="partType.id"
                    > &emsp;{{ partType.name }} </option>
                </template>
            </select>
        </div>
        <!--Car section-->
        <div class="uk-width-1-2@s">
            <label class="uk-form-label" for="car">Car</label>
            <select id="car" class="uk-select" :height="5">
                <template v-if="account.isAuthenticated && account.cars">
                    <option v-for="car in account.cars"
                            :key="car.id"
                            :value="car.id"
                    >{{ car.name }}</option>
                    <option :value="-1">Add..</option>
                </template>
                <template v-else>
                    <option></option>
                    <option :value="-1">Add..</option>
                </template>
            </select>
        </div>
        <!--Description-->
        <div class="uk-width-1-1@s">
            <textarea class="uk-textarea" rows="5" placeholder="*Feedback"></textarea>
        </div>
        <!--Stars-->
        <div class="uk-width-1-1@s">
            <vue-stars>
                <vk-icon icon="star" class="fill-star" slot-scope="props" slot="activeLabel"></vk-icon>
                <vk-icon icon="star" slot-scope="props" slot="inactiveLabel"></vk-icon>
            </vue-stars>
        </div>
        <!--Add images-->
        <div class="uk-width-1-1@s">
            <div uk-form-custom>
                <input type="file">
            <button class="uk-button uk-button-default" type="button" tabindex="-1">Select Img</button>
        </div>
        </div>
    </form>
    <article class="uk-comment">
        <div class="uk-comment-meta uk-margin-top"> * - Requirement fields</div>
    </article>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'AddFB',

    props: ['brandName'],

    created () {
        this.$http.get('/api/part-types/').then(
            response => this.$store.commit('SET_PART_TYPES', response.data)
        )
    },

    computed: {
        ...mapState({
            account: state => state.account
        }),
        ...mapGetters({
            partTypes: 'getPartTypes'
        })
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
