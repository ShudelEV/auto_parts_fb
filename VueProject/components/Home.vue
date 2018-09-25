<template>
    <div :style="{'min-height': $store.state.all.pageMinHeight + 'px'}">
        <!--Navbar-->
        <div id="header" class="uk-section uk-section-default uk-padding-remove-vertical">
            <div class="uk-card uk-hidden@m">
                <div class="uk-container">
                    <nav-bar-login :logo="logo"></nav-bar-login>
                </div>
            </div>
            <img id="header_image" src="/static/images/header.jpeg" alt=""
                 class="uk-align-center uk-margin-remove-top uk-margin-remove-bottom"
                 @load="$store.commit('SET_ELEMENTS_HEIGHT'); $store.state.all.showSearch=true"
            >
            <!--<img id="header_image" :src="$store.state.all.staticUrl + 'images/header.jpeg'" alt=""-->
                 <!--class="uk-align-center uk-margin-remove-top uk-margin-remove-bottom"-->
                 <!--@load="$store.commit('SET_ELEMENTS_HEIGHT'); $store.state.all.showSearch=true"-->
            <!--&gt;-->
            <div class="uk-container uk-position-top uk-visible@m">
                <!--<div uk-sticky="bottom: #header_image; animation: uk-animation-slide-top">-->
                    <nav-bar-login :logo="logo"></nav-bar-login>
                <!--</div>-->
            </div>
        </div>
        <!--Edit Account-->
        <!--<edit-account :show="$store.state.account.showEditUsername || $store.state.account.showEditPassword"></edit-account>-->
        <!--Body-->
        <div class="uk-container bg-img" :style="{'min-height': $store.state.all.contentMinHeight + 'px'}">
            <div class="uk-grid-large" uk-grid>
                <div class="uk-width-1-4@m">
                    <div uk-sticky="top: #header_image; offset: 20" media="@m">
                        <div v-if="$store.state.all.showSearch"
                             class="uk-card uk-card-default uk-card-small uk-card-default uk-card-body uk-background-muted"
                        >
                            <div class="uk-margin-small">
                                <div class="uk-inline">
                                    <a v-if="search_pattern"
                                        class="uk-icon-link uk-form-icon uk-form-icon-flip"
                                        uk-icon="close"
                                        @click="search_pattern = ''"
                                    ></a>
                                    <span class="uk-form-icon" uk-icon="search"></span>
                                    <input class="uk-input uk-form-small uk-form-width-medium"
                                           type="text"
                                           :placeholder="$t('Filter by brands')"
                                           :title="$t('Filter by brands')"
                                           v-model="search_pattern"
                                    >
                                </div>
                            </div>
                            <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
                                <li><a @click="$router.push({name: 'AllFB', query: {page: 1}})">
                                    <span class="uk-margin-small-right" uk-icon="list"></span>
                                    {{ $t('All feedbacks') }}
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="uk-width-expand@m" style="padding-bottom: 100px">
                    <div uk-grid="masonry: true"
                         class="uk-grid-small uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m uk-child-width-1-4@l"
                         uk-scrollspy="cls: uk-animation-slide-bottom; repeat: true"
                    >
                        <div v-for="(value, key) in sortedPartBrands(search_pattern)" class="uk-margin-bottom">
                            <div class="uk-card uk-card-default uk-card-small uk-card-hover uk-card-body" :key="key">
                                <span class="uk-card-title uk-margin-small-left">{{ key }}</span>
                                <ul class="uk-list uk-list-bullet">
                                    <li v-for="i in getArray(key)"
                                        @mouseover="addFBButton=value[i].id; dropWindow.push(value[i].id)"
                                    >
                                        <div class="uk-inline">
                                            <a class="uk-link-text"
                                               @click="gotoBrandFeedbacks(value[i])"
                                            >
                                                {{ value[i].name }}
                                            </a>
                                            <!--a part manufacturer information when to hover the link-->
                                            <div v-if="dropWindow.includes(value[i].id)" uk-drop="pos: top-center; mode: hover; delay-show: 1000; delay-hide: 300; flip: false"
                                                 @show="showElement('info-window' + value[i].id)"
                                            >
                                                <div class="uk-card uk-card-default uk-card-small"
                                                     :id="'info-window' + value[i].id"
                                                >
                                                    <div class="uk-card-body">
                                                        <div class="uk-flex uk-flex-center">
                                                            <img :src="value[i].image" :alt="value[i].name">
                                                        </div>
                                                        <div class="uk-padding-remove-bottom">
                                                            <dl class="uk-description-list uk-margin-remove-bottom">
                                                                <dt></dt>
                                                                <dt>{{ $t('Country') }}:</dt>
                                                                <dd>{{ $t(getCountry(value[i].country)) }}</dd>
                                                                <dt>{{ $t('Specialization') }}:</dt>
                                                                <dd>{{ value[i].specialization }}</dd>
                                                                <!--<dt>Link:</dt>-->
                                                                <!--<dd><a :href="value[i].site_url" target="_blank">{{value[i].site_url}}</a></dd>-->
                                                            </dl>
                                                        </div>
                                                    </div>
                                                    <div class="uk-card-footer">
                                                        <button class="uk-button uk-button-text"
                                                                @click="gotoBrandInfo(value[i].name)"
                                                        >{{ $t('Read more') }}</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <a v-show="addFBButton===value[i].id"
                                               class="uk-icon-link uk-margin-small-left"
                                                          uk-icon="plus-circle"
                                                          @click="$router.push({name: 'AddFB', params: {brandName: value[i].name}})"
                                                          :title="$t('Add feedback')"
                                            ></a>
                                            <span v-show="addFBButton!==value[i].id" class="uk-badge uk-margin-small-left">
                                                {{ value[i].fb_quantity }}
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                                <a uk-icon="more" class="uk-icon-link uk-margin-small-left"
                                    v-show="getArray(key).length < value.length && showAll != key"
                                    @click="showAll = key" :title="$t('Collapse')"
                                ></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COUNTRIES } from '../data'
import NavBarLogin from './NavBarLogin.vue'

export default {
    name: 'Home',

    components: { NavBarLogin, },

    data () {
        return {
            logo: 'PartsOK',
            // a card key when to show all part brands
            showAll: null,
            addFBButton: '',
            // how many part brands to show in a card?
            itemsShow: 5,
            // search box
            // by brand
            search_pattern: '',
            dropWindow: []
        }
    },

    mounted () {
        this.$nextTick(() => { this.$store.commit('SET_ELEMENTS_HEIGHT') })
    },

    computed: {
        ...mapGetters(['sortedPartBrands']),
    },

    methods: {
        // when list of part brands < itemsShow
        getArray (key) {
            let len = this.sortedPartBrands(this.search_pattern)[key].length;
            let showLen = this.sortedPartBrands(this.search_pattern)[key].filter(i => i.fb_quantity != 0).length;
            if (!showLen) { showLen = 1 }
            if (this.showAll === key) {
                return [...Array(len).keys()]
            } else {
                return showLen < this.itemsShow ? [...Array(showLen).keys()] : [...Array(this.itemsShow).keys()]
            }
        },
        gotoBrandFeedbacks (brand) {
            if (brand.fb_quantity) {
                this.$router.push({ name: 'AllBrandFB', params: { brandName: brand.name }, query: { page: 1 }})
            } else {
                this.$router.push({ name: 'AddFB', params: { brandName: brand.name }})
            }
        },
        removeAddFBButton () {
            setTimeout(() => { this.addFBButton = '' }, 250)
        },
        gotoBrandInfo (brandName) {
            this.$router.push({ name: 'BrandInfo', params: { brandName }})
        },
        // show an info window if it doesn't fit on the screen
        showElement(id) {
            setTimeout((id) => {
                const element = document.getElementById(id);
                if (element.getBoundingClientRect().top < 0) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 100, id)
        },
        getCountry (key) {
            return COUNTRIES[key]
        }
    }
}
</script>

<style>
    .uk-badge { background: #1e87f06b }
</style>
