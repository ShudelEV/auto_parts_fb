<template>
    <vk-grid gutter="large">
        <div class="uk-width-1-4@m">
            <vk-sticky top="#header_image" :offset="20" media="@m">
                <vk-card padding="small" class="uk-background-muted">
                    <div class="uk-margin-small">
                        <div class="uk-inline">
                            <vk-icon-link v-if="search_pattern"
                                          class="uk-form-icon uk-form-icon-flip"
                                          icon="close"
                                          @click="search_pattern = ''"
                            ></vk-icon-link>
                            <span class="uk-form-icon" uk-icon="icon: search"></span>
                            <input class="uk-input uk-form-small uk-form-width-medium"
                                   type="text" :placeholder="$t('Filter by brands')"
                                   v-model="search_pattern"
                            >
                        </div>
                    </div>
                    <vk-nav>
                        <vk-nav-item icon="list"
                                     @click="$router.push({name: 'AllFB', query: {page: 1}})"
                                     :title="$t('All feedbacks')"
                        >
                        </vk-nav-item>
                    </vk-nav>
                </vk-card>
            </vk-sticky>
        </div>
        <div class="uk-width-expand@m" style="padding-bottom: 100px">
            <div uk-grid="masonry: true"
                 class="uk-grid-small uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m uk-child-width-1-4@l"
                 uk-scrollspy="cls: uk-animation-slide-bottom; repeat: true"
            >
                <div v-for="(value, key) in sortedPartBrands(search_pattern)" class="uk-margin-bottom">
                    <vk-card :key="key" hover padding="small">
                        <vk-card-title class="uk-margin-small-left">{{ key }}</vk-card-title>
                        <ul class="uk-list uk-list-bullet">
                            <li v-for="i in getArray(key)"
                                @mouseover="addFBButton=value[i].name"
                            >
                                <div class="uk-inline">
                                    <a class="uk-link-text"
                                       @click="gotoBrandFeedbacks(value[i])"
                                    >
                                        {{ value[i].name }}
                                    </a>
                                    <!--a part manufacturer information when to hover the link-->
                                    <vk-drop position="top-center"
                                             :flip="false" mode="hover"
                                             :delay-hide="300" :delay-show="1000"
                                             @show="showElement('info-window' + value[i].id)"
                                    >
                                        <vk-card padding="small" :id="'info-window' + value[i].id">
                                            <div class="uk-flex uk-flex-center">
                                                <img class="uk-border-rounded" :src="value[i].image" alt="">
                                            </div>
                                            <div class="uk-padding-remove-bottom">
                                                <dl class="uk-description-list uk-margin-remove-bottom">
                                                    <dt></dt>
                                                    <dt>{{ $t('Country') }}:</dt>
                                                    <dd>{{getCountry(value[i].country)}}</dd>
                                                    <dt>{{ $t('Specialization') }}:</dt>
                                                    <dd>{{value[i].specialization}}</dd>
                                                    <!--<dt>Link:</dt>-->
                                                    <!--<dd><a :href="value[i].site_url" target="_blank">{{value[i].site_url}}</a></dd>-->
                                                </dl>
                                            </div>
                                            <div slot="footer">
                                                <vk-button type="text"
                                                           @click="gotoBrandInfo(value[i].name)"
                                                >{{ $t('Read more') }}</vk-button>
                                            </div>
                                        </vk-card>
                                    </vk-drop>
                                    <vk-icon-link v-show="addFBButton===value[i].name"
                                                  class="uk-margin-small-left"
                                                  reset icon="plus-circle"
                                                  @click="$router.push({name: 'AddFB', params: {brandName: addFBButton}})"
                                                  :title="$t('Add feedback')"
                                    ></vk-icon-link>
                                    <span v-show="addFBButton!==value[i].name" class="uk-badge uk-margin-small-left">
                                        {{ value[i].fb_quantity }}
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <vk-icon-link reset icon="more" class="uk-margin-small-left"
                            v-show="getArray(key).length < value.length && showAll != key"
                            @click="showAll = key" :title="$t('Collapse')"
                        ></vk-icon-link>
                    </vk-card>
                </div>
            </div>
        </div>
    </vk-grid>
</template>

<script>
import { mapGetters } from 'vuex'
import { COUNTRIES } from '../data'

export default {
    name: 'Home',

    components: {},

    data () {
        return {
            // a card key when to show all part brands
            showAll: null,
            addFBButton: '',
            // how many part brands to show in a card?
            itemsShow: 5,
            // search box
            // by brand
            search_pattern: '',
        }
    },

    mounted () {
        this.$store.commit('SET_ELEMENTS_HEIGHT')
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
             console.log('delete')
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
