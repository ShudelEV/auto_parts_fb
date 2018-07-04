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
                    <vk-grid gutter="small" class="uk-child-width-expand@s">
                        <div v-for="i in [1,2,3]">
                            <div v-for="item in alphabet.splice(0, 9)"
                                 class="uk-margin-bottom"
                            >
                                <vk-card :key="item"
                                         hover
                                         padding="small"
                                >
                                    <vk-card-title>{{ item }}</vk-card-title>
                                    <ul class="uk-list uk-list-bullet">
                                        <li v-for="value in prepListPartBrands(item)">
                                            {{ value }}
                                        </li>
                                    </ul>
                                    <vk-button type="text">...</vk-button>
                                </vk-card>
                            </div>
                        </div>
                        <!--<div>-->
                            <!--<div v-for="item in String.fromCharCode(73,74,75,76,77,78,79)" class="uk-margin-bottom">-->
                                <!--<vk-card :key="item"-->
                                         <!--hover-->
                                         <!--padding="small"-->
                                <!--&gt;-->
                                    <!--<vk-card-title>{{ item }}</vk-card-title>-->
                                <!--</vk-card>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div>-->
                            <!--<div v-for="item in String.fromCharCode(80,81,82,83,84,85)" class="uk-margin-bottom">-->
                                <!--<vk-card :key="item"-->
                                         <!--hover-->
                                         <!--padding="small"-->
                                <!--&gt;-->
                                    <!--<vk-card-title>{{ item }}</vk-card-title>-->
                                <!--</vk-card>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div>-->
                            <!--<div v-for="item in String.fromCharCode(86,87,88,89,90)" class="uk-margin-bottom">-->
                                <!--<vk-card :key="item"-->
                                         <!--hover-->
                                         <!--padding="small"-->
                                <!--&gt;-->
                                    <!--<vk-card-title>{{ item }}</vk-card-title>-->
                                <!--</vk-card>-->
                            <!--</div>-->
                        <!--</div>-->
                    </vk-grid>
                </div>
            </vk-grid>
        </div>
        <!--<router-view></router-view>-->
    </div>
</div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    name: 'App',

    components: {  },

    data () {
        return {
            alphabet: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q",
                "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
        }
    },

    created () {
        axios.get('/api/part-brands/').then(
            response => this.$store.commit('SET_PART_BRANDS', response.data)
        )
    },

    computed: {
        ...mapState({
            partBrands: state => state.all.partBrands
        }),
    },

    methods: {
        prepListPartBrands(item) {
            return this.partBrands
                .filter( i => i.name[0] === item)
//                .sort((a, b) => {
//                    if (a.fb_qty > b.fb_qty) { return 1; }
//                    else { return -1; }
//                })
        }
    }
}
</script>
