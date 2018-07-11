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
                <div v-for="(value, key) in sortedPartBrands"
                     class="uk-margin-bottom"
                >
                    <vk-card :key="key" hover padding="small">
                        <vk-card-title>{{ key }}</vk-card-title>
                        <ul class="uk-list uk-list-bullet">
                            <template v-if="showAll === key">
                                <li v-for="partBrand in value">
                                    <vk-button type="text"
                                               @click="gotoBrandFeedbacks(partBrand.name)"
                                    >
                                        {{ partBrand.name + ' (' + partBrand.fb_quantity + ')' }}
                                    </vk-button>
                                </li>
                            </template>
                            <template v-else>
                                <li v-for="i in getArray(value.length)">
                                    <vk-button type="text"
                                               @click="gotoBrandFeedbacks(value[i].name)"
                                    >
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
        getArray (len) {
            return len > this.itemsShow ? [...Array(this.itemsShow).keys()] : [...Array(len).keys()]
        },
        gotoBrandFeedbacks (name) {
            this.$router.push({ name: 'Brand', params: { name: name }})
        }
    }
}
</script>
