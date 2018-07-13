<template>
    <vk-grid gutter="large">
        <div class="uk-width-1-4@m">
            <vk-card>Menu</vk-card>
        </div>
        <div class="uk-width-expand@m">
            <div uk-grid="masonry: true"
                 class="uk-grid-small uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m"
                 uk-scrollspy="cls: uk-animation-slide-bottom; repeat: true"
            >
                <div v-for="(value, key) in sortedPartBrands" class="uk-margin-bottom">
                    <vk-card :key="key" hover padding="small">
                        <vk-card-title class="uk-margin-small-left">{{ key }}</vk-card-title>
                        <ul class="uk-list uk-list-bullet">
                            <li v-for="i in getArray(key)">
                                <a class="uk-link-text" @click="gotoBrandFeedbacks(value[i].name)">
                                    {{ value[i].name }}
                                </a>
                                <span class="uk-badge uk-margin-small-left">
                                    {{ value[i].fb_quantity }}
                                </span>
                            </li>
                        </ul>
                        <vk-icon-link reset icon="more" class="uk-margin-small-left"
                            v-show="getArray(key).length < value.length && showAll != key"
                            @click="showAll = key"
                        ></vk-icon-link>
                    </vk-card>
                </div>
            </div>
        </div>
    </vk-grid>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Home',

    data () {
        return {
            // a card key when to show all part brands
            showAll: null,
            // how many part brands to show in a card?
            itemsShow: 5,
        }
    },

    created () {
        this.$http.get('/api/part-brands/').then(
            response => this.$store.commit('SET_PART_BRANDS', response.data)
        )
    },

    computed: {
        ...mapGetters(['sortedPartBrands']),
    },

    methods: {
        // when list of part brands < itemsShow
        getArray (key) {
            let len = this.sortedPartBrands[key].length;
            let showLen = this.sortedPartBrands[key].filter(i => i.fb_quantity != 0).length;
            if (!showLen) { showLen = 1 }
            if (this.showAll === key) {
                return [...Array(len).keys()]
            } else {
                return showLen < this.itemsShow ? [...Array(showLen).keys()] : [...Array(this.itemsShow).keys()]
            }
        },
        gotoBrandFeedbacks (name) {
            this.$router.push({ name: 'BrandFB', params: { name: name }});
            this.$emit('setLogo', name)
        }
    }
}
</script>

<style>
    .uk-badge { background: #1e87f06b }
</style>
