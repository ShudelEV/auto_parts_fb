<template>
<div>
    <div class="uk-position-relative">
        <img src="/static/images/header.jpeg" alt="" id="offset">
        <div class="uk-container uk-position-top">
            <vk-sticky bottom="#offset">
                <vk-navbar transparent class="uk-navbar-sticky">
                    <vk-navbar-nav>
                        <vk-navbar-logo>PartsOK</vk-navbar-logo>
                    </vk-navbar-nav>
                    <vk-navbar-nav slot="right">
                        <!--Register/Login bar-->
                        <vk-navbar-item v-if="!account.isAuthenticated">
                            <form ref="form" >
                                <div class="uk-inline">
                                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                                    <input class="uk-input uk-form-width-small uk-form-small uk-margin-small-right"
                                           name="login"
                                           type="text">
                                </div>
                                <div class="uk-inline">
                                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                                    <input class="uk-input uk-form-width-small uk-form-small uk-margin-small-right"
                                           name="password"
                                           type="password">
                                </div>
                                <vk-button class="uk-button-small" @click="register()">Reg</vk-button>
                                <vk-icon-link @click="login()" icon="sign-in">Login</vk-icon-link>
                            </form>
                        </vk-navbar-item>
                        <!--Account bar-->
                        <vk-navbar-item v-else>
                            <ul class="uk-iconnav">
                                <li><vk-icon icon="user" :title="account.name"></vk-icon></li>
                                <li><vk-icon-link href="#" icon="file-edit" title="Edit account"></vk-icon-link></li>
                                <li><vk-icon-link @click="logout()" icon="sign-out" title="Sing out"></vk-icon-link></li>
                            </ul>
                        </vk-navbar-item>
                        <!--Error notification-->
                        <vk-notification :messages.sync="account.error" status="danger"></vk-notification>
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
                    <div uk-grid="masonry: true"
                         class="uk-grid-small uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m"
                    >
                        <div v-for="(value, key) in sortedPartBrands"
                             class="uk-margin-bottom"
                        >
                            <vk-card :key="key" hover padding="small">
                                <vk-card-title>{{ key }}</vk-card-title>
                                <ul class="uk-list uk-list-bullet">
                                    <template v-if="showAll === key">
                                        <li v-for="partBrand in value">
                                            <vk-button type="text">
                                                {{ partBrand.name + ' (' + partBrand.fb_quantity + ')' }}
                                            </vk-button>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li v-for="i in getArray(value.length)">
                                            <vk-button type="text">
                                                {{ value[i].name + ' (' + value[i].fb_quantity + ')' }}
                                            </vk-button>
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
// to use $http (import only in one place):
import { mapGetters, mapState } from 'vuex'

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
        this.$http.get('/api/part-brands/').then(
            response => this.$store.commit('SET_PART_BRANDS', response.data)
        )
    },

    computed: {
        ...mapGetters(['sortedPartBrands']),
        ...mapState({
            account: state => state.account
        })
    },

    methods: {
        // when list of part brands < itemsShow
        getArray (len) {
            return len > this.itemsShow ? [...Array(this.itemsShow).keys()] : [...Array(len).keys()]
        },
        register () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('registerWithEmailAndPassword', {
                'username': form.login.value,
                'password': form.password.value
            })
        },
        // get token
        login () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('getToken', {
                'username': form.login.value,
                'password': form.password.value
            })
        },
        logout () {
            this.$store.dispatch('destroyToken')
        }
    }
}
</script>
