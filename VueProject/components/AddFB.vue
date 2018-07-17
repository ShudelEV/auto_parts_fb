<template>
<div>
    <div class="uk-width-1-1">
        <h2>Add Your Feedback</h2>
    </div>
    <form class="uk-grid-small" uk-grid ref="form2">
        <!--Add part-->
        <template v-if="part == -1">
            <div class="uk-width-1-4@s">
                <label class="uk-form-label" for="part_category"> *Part Category</label>
                <select id="part_category" v-model="part_category" name="part_category" class="uk-select" autofocus>
                    <option v-for="(value, key) in categories"
                            :value="key"
                    >{{ value }}</option>
                </select>
            </div>
            <div class="uk-width-1-4@s">
                <label class="uk-form-label" for="part_name"> *Part Name</label>
                <input id="part_name" class="uk-input" v-model="part_name" name="part_name" type="text">
            </div>
        </template>
        <!--Select part-->
        <div v-else class="uk-width-1-2@s">
            <label class="uk-form-label" for="part"> *Part</label>
            <select v-model="part" id="part" name="part" class="uk-select" autofocus>
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
        <!--Add car-->
        <template v-if="car == -1">
            <div class="uk-width-1-2@s"></div>
            <div class="uk-width-1-4@s">
                <label class="uk-form-label" for="car_brand"> *Car Brand</label>
                <input id="car_brand" class="uk-input" v-model="car_brand" name="car_brand" type="text">
            </div>
            <div class="uk-width-1-4@s">
                <label class="uk-form-label" for="car_model"> *Car Model</label>
                <input id="car_model" class="uk-input" v-model="car_model" name="car_model" type="text">
            </div>
        </template>
        <!--Select car-->
        <div v-else class="uk-width-1-2@s">
            <label class="uk-form-label" for="car">Car</label>
            <select v-model="car" id="car" name="car" class="uk-select" :height="5">
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
            <textarea name="fb" class="uk-textarea" rows="5" placeholder="*Feedback"></textarea>
        </div>
        <!--Stars-->
        <div class="uk-width-1-1@s">
            <vue-stars v-model="stars" name="stars">
                <vk-icon icon="star" class="fill-star" slot-scope="props" slot="activeLabel"></vk-icon>
                <vk-icon icon="star" slot-scope="props" slot="inactiveLabel"></vk-icon>
            </vue-stars>
        </div>
        <!--Add images-->
        <!--<div class="uk-width-1-1@s">-->
            <!--<div uk-form-custom>-->
                <!--<input type="file" name="image">-->
            <!--<button class="uk-button uk-button-default" type="button" tabindex="-1">Select Img</button>-->
        <!--</div>-->
        <!--</div>-->
    </form>
    <hr>
    <article class="uk-comment">
        <div class="uk-comment-meta uk-margin-top"> * - Requirement fields</div>
    </article>
    <!--Buttons-->
    <hr>
    <p>
        <vk-button class="uk-margin-right">Clear</vk-button>
        <vk-button type="primary" @click="sendFB()">Send</vk-button>
    </p>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'AddFB',

    props: ['brandName'],

    data () {
        return {
            error: [],
            part: null,
            part_category: null,
            part_name: '',
            car: null,
            car_brand: null,
            car_model: null,
            stars: 0
        }
    },

    created () {
        this.$http.get('/api/part-types/').then(
            response => this.$store.commit('SET_PART_TYPES', response.data)
        )
    },

    computed: {
        ...mapState({
            account: state => state.account,
            categories: state => state.all.partCategories
        }),
        ...mapGetters({
            partTypes: 'getPartTypes'
        })
    },

    methods: {
        sendFB () {
            const form = this.$refs.form2.elements;
            this.$http.post('/api/feedbacks/' + this.brandName + '/create/', {
                part: this.part,
                car: this.car,
                description: form.fb.value,
                stars: this.stars,
//                images: form.image.value
            }).then(
                response => {
                    this.goBack();
                    console.log('Response: ' + response);
                }
            ).catch(
                error => {this.error = error; console.log('Response: ' + response)}
            )
        },
        goBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        }
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
