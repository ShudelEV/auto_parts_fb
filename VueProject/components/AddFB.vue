<template>
<div>
    <!--Notification-->
    <vk-notification :messages.sync="message" status="success"></vk-notification>
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
                <!--<option></option>-->
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
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="car_brand"> Car Brand</label>
                <select @input="addCarModel = false"
                        id="car_brand" v-model="car_brand"
                        name="car_brand" class="uk-select"
                >
                    <option></option>
                    <option v-for="brand in carBrands">{{ brand }}</option>
                </select>
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="car_model"> Car Model</label>
                <input v-if="addCarModel" autofocus
                       :disabled="!car_brand"
                       id="car_model" class="uk-input" type="text"
                       v-model="car_model_name"
                       name="car_model_name"
                >
                <select v-else id="car_model"
                        :disabled="!car_brand"
                        v-model="car_model"
                        name="car_model" class="uk-select"
                >
                    <option value="-1">Add..</option>
                    <option v-for="model in getCarModels(car_brand)"
                            :value="model.id"
                    >{{ model.name }}</option>
                </select>
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="car_year"> Car Year</label>
                <select :disabled="!car_brand" id="car_year"
                        v-model="car_year" name="car_year" class="uk-select"
                >
                    <option></option>
                    <option v-for="year in yearList(1980, 2018)">{{ year }}</option>
                </select>
            </div>
            <!--<div class="uk-width-1-2@s"></div>-->
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="engine_volume"> Engine Volume</label>
                <input id="engine_volume" class="uk-input"
                       :disabled="!car_brand"
                       v-model="engine_volume" maxlength="4"
                       name="engine_volume" type="text"
                >
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="engine_type"> Engine Type</label>
                <select :disabled="!car_brand" id="engine_type"
                        v-model="engine_type" name="engine_type" class="uk-select"
                >
                    <option></option>
                    <option v-for="(value, key) in engineTypes" :value="key">{{ value }}</option>
                </select>
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="gear"> Gear Type</label>
                <select :disabled="!car_brand" id="gear"
                        v-model="gear" name="gear" class="uk-select"
                >
                    <option></option>
                    <option v-for="(value, key) in gearTypes" :value="key">{{ value }}</option>
                </select>
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
            <textarea v-model="description" name="fb"
                      class="uk-textarea" rows="5" placeholder="*Feedback"
            ></textarea>
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
        <div class="uk-comment-meta uk-margin-top"> * - Required fields</div>
    </article>
    <hr>
    <!--Buttons-->
    <template v-if="!account.suggestLogin">
        <p>
            <vk-button class="uk-margin-right" @click="resetForm()">Clear</vk-button>
            <vk-button type="primary"
                       @click="preSend()"
                       :disabled="!sendPermit"
                       :title="sendPermit ? 'Send feedback' : '*Fill required fields.'"
            >Send</vk-button>
        </p>
    </template>
    <!--Suggest to log in-->
    <template v-else>
        <p>Хотите войти, чтобы в дальнейшем у Вас была возможность редактировать
            Ваши комментарии и видеть добавленные вами авто?</p>
        <vk-button class="uk-margin-right" @click="sendFB()">No</vk-button>
        <vk-button type="primary" @click="$store.state.account.showLoginWindow = true">Yes</vk-button>
    </template>
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
            message: [],
            part: null,
            part_category: null,
            part_name: '',
            car: null,
            car_brand: null,
            car_model: null,
            car_model_name: '',
            car_year: null,
            engine_volume: null,
            engine_type: null,
            gear: null,
            description: '',
            stars: 0,
            engineTypes: {
                1: 'benzine',
                2: 'diesel',
                3: 'gas-benzine',
                4: 'electric',
                5: 'hybrid'
            },
            gearTypes: {
                1: 'manual',
                2: 'automatic',
                3: 'semi-automatic',
                4: 'CVT'
            },
            suggestLogin: false,
        }
    },

    created () {
        this.$http.get('/api/part-types/').then(
            response => this.$store.commit('SET_PART_TYPES', response.data)
        )
    },

    computed: {
        addCarModel: {
            get: function () {
                return this.car_model == -1 ? true : false
            },
            set: function () {
                this.car_model_name = '';
                this.car_model = null
            }
        },
        sendPermit: function () {
            // Check part fields
            const a = this.part != -1 ? !!this.part : !!this.part_category && !!this.part_name;
            // Check description
            const b = !!this.description;
            return a && b
        },
        ...mapState({
            account: state => state.account,
            categories: state => state.all.partCategories,
            carBrands: state => state.all.carBrands,
            carModels: state => state.all.carModels,
        }),
        ...mapGetters({
            partTypes: 'getPartTypes',
            getCarModels: 'getCarModels',
        })
    },

    watch: {
        // Load a car models list once
        car: function (val) {
            if (val == -1 && !this.carModels) {
                this.$http.get('/api/car-models/').then(
                    response => this.$store.commit('SET_CAR_MODELS', response.data)
                )
            }
        }
    },

    methods: {
        preSend () {
            if (!Number(this.engine_volume)) {
                // Validate engine volume field
                this.message.push({ message: 'Incorrect engine volume.', status: 'warning' })
            }
            if (!this.stars) {
                // star animation
                for (let i = 0; i <= 5; i++) { setTimeout(this.setStar, i*150, i) }
                setTimeout(this.setStar, 1250, 0);
                // Push message
                this.message.push({ message: 'Please, note the part.', status: 'warning' })
            } else if (!this.account.isAuthenticated) {
                this.account.suggestLogin = true
            } else { this.sendFB() }
        },
        setStar (a) {this.stars = a},
        sendFB () {
            const form = this.$refs.form2.elements;
            this.$http.post('/api/feedbacks/' + this.brandName + '/create/', {
                part: this.part,
                car: this.car,
                description: form.fb.value,
                stars: this.stars,
//               images: form.image.value
            }).then(
                response => {
                    this.goBack();
                    console.log('Response: ' + response);
                }
            ).catch(
                error => {
                    this.error = error;
                    console.log('Response: ' + response)
                }
            )
        },
        goBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
        yearList (start, end) {
            let res = [];
            for (let i = end; i >= start; i--) {
                res.push(i)
            }
            return res
        },
        resetForm () {
            this.error = [];
            this.message = [];
            this.part = null;
            this.part_category = null;
            this.part_name = '';
            this.car = null;
            this.car_brand = null;
            this.car_model = null;
            this.car_model_name = '';
            this.car_year = null;
            this.engine_volume = null;
            this.engine_type = null;
            this.gear = null;
            this.description = '';
            this.stars = 0;
        }
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
