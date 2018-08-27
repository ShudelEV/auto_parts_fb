<template>
<div>
    <div class="uk-width-1-1">
        <h2>Add Your Feedback</h2>
    </div>
    <form class="uk-grid-small" uk-grid ref="form2">
        <!--Add part-->
        <template v-if="part == -1">
            <div class="uk-width-1-4@s">
                <label class="uk-form-label" for="part_category">*Part Category</label>
                <select id="part_category" v-model="new_part_type.category" name="part_category" class="uk-select" autofocus>
                    <option v-for="(value, key) in categories"
                            :value="key"
                    >{{ value }}</option>
                </select>
            </div>
            <div class="uk-width-1-4@s">
                <label class="uk-form-label" for="part_name">*Part Name</label>
                <input id="part_name" class="uk-input" v-model="new_part_type.name" name="part_name" type="text">
            </div>
        </template>
        <!--Select part-->
        <div v-else class="uk-width-1-2@s">
            <label class="uk-form-label" for="part">*Part</label>
            <select v-model="part" id="part" name="part" class="uk-select" autofocus>
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
                <label class="uk-form-label" for="car_brand">*Car Brand</label>
                <!--Reset the car model name if the car model is changed-->
                <select @input="new_car.model_name = ''; new_car.model = null"
                        id="car_brand" v-model="new_car.brand"
                        name="car_brand" class="uk-select"
                >
                    <option></option>
                    <option v-for="brand in carBrands">{{ brand }}</option>
                </select>
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="car_model">*Car Model</label>
                <input v-if="new_car.model == -1" autofocus
                       :disabled="!new_car.brand"
                       id="car_model" class="uk-input" type="text"
                       v-model="new_car.model_name"
                       name="car_model_name"
                >
                <select v-else id="car_model"
                        :disabled="!new_car.brand"
                        v-model="new_car.model"
                        name="car_model" class="uk-select"
                >
                    <option value="-1">Add..</option>
                    <option v-for="model in getCarModels(new_car.brand)"
                            :value="model.id"
                    >{{ model.name }}</option>
                </select>
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="car_year">Car Year</label>
                <select :disabled="!new_car.brand" id="car_year"
                        v-model="new_car.year" name="car_year" class="uk-select"
                >
                    <option></option>
                    <option v-for="year in yearList(1980, 2018)">{{ year }}</option>
                </select>
            </div>
            <!--<div class="uk-width-1-2@s"></div>-->
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="engine_volume">Engine Volume</label>
                <input id="engine_volume" class="uk-input"
                       :disabled="!new_car.brand"
                       v-model="new_car.engine_volume" maxlength="4"
                       name="engine_volume" type="text"
                >
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="engine_type">Engine Type</label>
                <select :disabled="!new_car.brand" id="engine_type"
                        v-model="new_car.engine_type" name="engine_type" class="uk-select"
                >
                    <option></option>
                    <option v-for="(value, key) in engineTypes" :value="key">{{ value }}</option>
                </select>
            </div>
            <div class="uk-width-1-6@s">
                <label class="uk-form-label" for="gear">Gear Type</label>
                <select :disabled="!new_car.brand" id="gear"
                        v-model="new_car.gear" name="gear" class="uk-select"
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
                <option></option>
                <option :value="-1">Add..</option>
                <template v-if="account.isAuthenticated && account.cars">
                    <option v-for="car in cars"
                            :key="car.id"
                            :value="car.id"
                    >{{ car.model }}</option>
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
            <vue-stars v-model="stars" name="stars"></vue-stars>
        </div>
        <!--Add images-->
        <div class="uk-width-1-1@s">
            <div class="img-uploader">
                <upload-image
                    ref="images_form"
                    :url="imageUploadURL"
                    name="image"
                    :resize_enabled="true"
                    input_id="image_input"
                    button_class="button_hidden"
                    @upload-image-success="uploadImageSuccess()"
                    @upload-image-failure="() => {
                        $store.commit('SET_MESSAGE', {message: 'Error image upload', status: 'danger'});
                        gotoAllFB()
                    }"
                ></upload-image>
                <span class="img-uploader-text" v-if="!imagesQty()">drop or click to add images here</span>
            </div>
        </div>
    </form>
    <hr>
    <article class="uk-comment">
        <div class="uk-comment-meta uk-margin-top"> * - Required fields</div>
    </article>
    <hr>
    <!--Buttons-->
    <template v-if="account.showSuggestLogin"> <!--Suggest to log in-->
        <p>Хотите войти, чтобы в дальнейшем у Вас была возможность редактировать
            Ваши комментарии и видеть добавленные вами авто?</p>
        <vk-button class="uk-margin-right" @click="sendFBAnonymous()">No</vk-button>
        <vk-button type="primary" @click="$store.state.account.showLoginWindow = true">Yes</vk-button>
    </template>
    <template v-else>
        <p>
            <vk-button class="uk-margin-right"
                       @click="resetForm()"
                       title="Clear form"
            >Clear</vk-button>
            <vk-button type="primary"
                       @click="preSend()"
                       :disabled="!sendPermit"
                       :title="sendPermit ? 'Send feedback' : '*Fill required fields.'"
            >Send</vk-button>
        </p>
    </template>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import UploadImage from 'vue-upload-image'
import { ENGINE_TYPES, GEAR_TYPES } from '../data'

export default {
    name: 'AddFB',

    components: { UploadImage, },

    props: ['brandName'],

    data () {
        return {
            part: null,
            new_part_type: {
                category: null,
                name: '',
            },
            car: null,
            new_car: {
                brand: null,
                model: null,
                model_name: '',
                year: null,
                engine_volume: '',
                engine_type: null,
                gear: null,
            },
            description: '',
            stars: 0,
            imageUploadURL: '',
            uploadedImagesQty: 0,
            engineTypes: ENGINE_TYPES,
            gearTypes: GEAR_TYPES
        }
    },

    created () {
        this.$http.get('/api/part-types/').then(
            response => this.$store.commit('SET_PART_TYPES', response.data)
        )
    },

    computed: {
        // activate or deactivate the SEND button
        sendPermit: function () {
            // Check part fields
            const a = this.part == -1 ? !!this.new_part_type.category && !!this.new_part_type.name : !!this.part;
            // Check new_car
                // Check car model
            const b2 = this.new_car.model == -1 ? !!this.new_car.model_name : !!this.new_car.model;
            const b = this.car == -1 ? !!this.new_car.brand && b2 : true;
            // Check description
            const c = !!this.description;
            return a && b && c
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
            cars: 'carList'
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
            if (isNaN(this.new_car.engine_volume)) {
                // Validate engine volume field
                this.$store.commit('SET_MESSAGE', { message: 'Incorrect engine volume.', status: 'danger' })
            } else if (!this.stars) {
                // star animation
                for (let i = 0; i <= 5; i++) { setTimeout(this.setStar, i*150, i) }
                setTimeout(this.setStar, 1250, 0);
                // Push message
                this.$store.commit('SET_MESSAGE', { message: 'Please, note the part.', status: 'danger' })
            } else if (
                // Show the suggest only once for a session
                !this.account.isAuthenticated && !this.account.showSuggestLogin && !sessionStorage.getItem('notSuggestLogin')
            ) {
                this.account.showSuggestLogin = true
            } else {
                this.account.isAnonymous && !this.account.isAuthenticated ? this.sendFBAnonymous() : this.sendFB()
            }
        },
        setStar (a) { this.stars = a },
        sendFBAnonymous () {
            sessionStorage.setItem('notSuggestLogin', true);
            // create anonymous user and then to send the FB
            const callBack = () => {
                this.sendFB();
                this.$store.state.account.showSuggestLogin = false;
            };
            this.$store.dispatch('registerAnonymousUser', callBack);
        },
        sendFB () {
            let form = {
                description: this.description,
                stars: this.stars,
            };
            if ( this.part != -1 ) {
                form.part = this.part
            } else {
                // Create a new part type
                form.new_part_type = this.new_part_type;
            }
            if ( this.car != -1 || !this.new_car.brand ) {
                form.car = this.car
            } else {
                // Create a new car
                form.new_car = this.new_car;
                form.new_car.engine_volume = Number(this.new_car.engine_volume);
                if (this.new_car.model == -1) {
                    delete form.new_car.model
                } else {
                    delete form.new_car.model_name;
                }
            }
            this.$http.post('/api/' + this.brandName + '/feedbacks/create/', form)
                .then(response => {
                    this.$store.commit('SET_MESSAGE', { message: 'Feedback successful created. ', status: 'success' });
                    if (response.data.new_car) {
                        this.$store.state.account.cars.push(response.data.new_car)
                    }
                    if (Object.keys(this.$refs.images_form.image).length) {
                        this.uploadImages(response.data.id)
                    } else { this.gotoAllFB() }
                    this.$store.state.all.newFBId = response.data.id
                })
                .catch(error => {
                    this.$store.commit('SET_MESSAGE', { message: error.response.data, status: 'danger' })
                })
        },
        uploadImages (fbId) {
            this.imageUploadURL = '/api/' + this.brandName + '/feedbacks/' + fbId + '/images/add/';
            // click the submit button, $nextTick for waiting when the url prop is changed
            this.$refs.images_form.$nextTick(() => {
                document.getElementById('upload_image_form--image_input').getElementsByTagName('button')[0].click()
            })
        },
        // go to the feedback list if all images are uploaded
        uploadImageSuccess () {
            this.uploadedImagesQty += 1;
            if (this.imagesQty() == this.uploadedImagesQty) {
                this.gotoAllFB()
            }
        },
        // images qty in the form?
        imagesQty () {
            return this.$refs.images_form ? Object.keys(this.$refs.images_form.image).length : 0
        },
        goBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
        gotoAllFB () {
            this.$router.push({ name: 'AllFB', params: { brandName: this.brandName, page_number: 1 } })
        },
        yearList (start, end) {
            let res = [];
            for (let i = end; i >= start; i--) {
                res.push(i)
            }
            return res
        },
        resetForm () {
            this.part = null;
            this.new_part_type = {
                category: null,
                name: ''
            };
            this.car = null;
            this.new_car = {
                brand: null,
                model: null,
                model_name: '',
                year: null,
                engine_volume: '',
                engine_type: null,
                gear: null,
            };
            this.description = '';
            this.stars = 0;
            // delete images
            if (this.imagesQty()) {
//                console.log(this.$refs.images_form)
                const imgUploader = this.$refs.images_form;
                // convert Observer to Object
                const files = JSON.parse(JSON.stringify(imgUploader.files));
                for (let key in files) {
                    imgUploader.$delete(imgUploader.files, key);
                    imgUploader.$delete(imgUploader.image, key)
                }
            }
        }
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star-red svg[meta='vk-icons-star'] polygon { fill: red; }
    .uk-icon.fill-star-yellow svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
    .uk-icon.fill-star-green svg[meta='vk-icons-star'] polygon { fill: green; }

    div.img-uploader {
        position: relative;
        overflow-y: hidden;
        border-radius: 6px;
        border: 1px dashed #ccc;
        background-color: #fafafa;
        opacity: 0.9;
    }
    .img-uploader .img-uploader-text {
        position: absolute;
        font-size: 200%;
        left: 0;
        width: 100%;
        text-align: center;
        color: lightgray;
        top: 25%;
        z-index: -1;
    }
    /*min height for "drop or choose images" field*/
    .upload_image_form__thumbnails { min-height: 80px }
    /*Hide the "Upload images" button*/
    .vue_component__upload--image .upload_image_form__thumbnails {
        margin-bottom: 0 !important;
    }
    .button_hidden { display: none; }
</style>
