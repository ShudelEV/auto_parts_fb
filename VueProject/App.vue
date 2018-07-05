<template>
<div >
    <div class="uk-position-relative">
        <img src="/static/images/header.jpeg" alt="">
        <div class="uk-position-top">
            <vk-sticky>
                <vk-navbar transparent class="uk-navbar-sticky">
                    <vk-navbar-nav>
                        <vk-navbar-logo>AutoParts</vk-navbar-logo>
                    </vk-navbar-nav>
                    <vk-navbar-nav slot="right">
                        <vk-navbar-item>
                            <form>
                                <div class="uk-inline">
                                    <input class="uk-input uk-form-width-small uk-form-small uk-margin-small-right"
                                            type="text" placeholder="Login">
                                </div>
                                <input class="uk-input uk-form-width-small uk-form-small uk-margin-small-right"
                                       type="text" placeholder="Password">
                                <vk-button class="uk-button-small">Login</vk-button>
                            </form>
                        </vk-navbar-item>
                    </vk-navbar-nav>
                </vk-navbar>
            </vk-sticky>
        </div>
    </div>
    <div class="uk-section uk-section-default uk-section-xsmall">
        <div class="uk-container">
            <vk-grid gutter="large">
                <div class="uk-width-1-4@m">
                    <vk-card>Menu</vk-card>
                </div>
                <div class="uk-width-expand@m">
                    <div uk-grid="masonry: true" class="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m">
                        <div v-for="(value, key) in sortedPartBrands"
                             class="uk-margin-bottom"
                        >
                            <vk-card :key="key" hover padding="small">
                                <vk-card-title>{{ key }}</vk-card-title>
                                <ul class="uk-list uk-list-bullet">
                                    <template v-if="showAll === key">
                                        <li v-for="partBrand in value">
                                            {{ partBrand.name }}
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li v-for="i in getArray(value.length)">
                                            {{ value[i].name }}
                                        </li>
                                    </template>
                                </ul>
                                <vk-button v-show="itemsShow < value.length && showAll != key"
                                           @click="showAll = key"
                                           type="text"
                                >...</vk-button>
                            </vk-card>
                        </div>
                    </div>
                </div>
            </vk-grid>
        </div>
        <!--<router-view></router-view>-->
    </div>
</div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
    name: 'App',

    components: {  },

    data () {
        return {
            // a card key when to show all part brands
            showAll: null,
            // how many part brands to show in a card?
            itemsShow: 5
        }
    },

    created () {
        axios.get('/api/part-brands/').then(
            response => this.$store.commit('SET_PART_BRANDS', response.data)
        )
    },

    computed: {
        ...mapGetters(['sortedPartBrands']),
    },

    methods: {
        // when list of part brands < itemsShow
        getArray (len) {
            return len > this.itemsShow ? [...Array(this.itemsShow).keys()] : [...Array(len).keys()]
        }
    }
}
</script>
