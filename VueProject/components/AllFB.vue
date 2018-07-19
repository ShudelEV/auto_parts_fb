<template>
<span>
<!--Collapse button-->
<span class="uk-clearfix" v-if="!!feedbacks.length">
    <vk-icon-link title="Collapse" class="uk-float-right"
                  :icon="collapse ? 'chevron-up' : 'chevron-down'"
                  @click="toggleAccordion()"
    ></vk-icon-link>
</span>
    <!--Feedbacks section-->
<ul uk-accordion="multiple: true" id="accordion" class="uk-list uk-list-divider">
    <!--Feedback-->
    <li v-for="fb in feedbacks" :key="fb.id">
        <!--Header-->
        <a class="uk-accordion-title" href="#">
            <vk-icon icon="cog"></vk-icon> {{ fb.part.type }}
            <template v-if="fb.part.car" >
                <vk-icon-image src="/static/images/car.svg" uk-svg class="uk-margin-small-left"></vk-icon-image>
                {{ fb.part.car.model }}
            </template>
            <!--Stars-->
            <div class="uk-margin-medium-left uk-display-inline-block">
                <vk-icon v-for="i in [1,2,3,4,5]" :key="i"
                     :class="i <= fb.stars ? 'fill-star' : ''"
                     icon="star"
                ></vk-icon>
            </div>
        </a>
        <!--Content-->
        <div class="uk-accordion-content">
            <article class="uk-comment">
                <!--Feedback text-->
                <div class="uk-comment-body"><p>{{ fb.description }}</p></div>
                <!--Images-->
                <div v-if="fb.images" class="uk-position-relative uk-visible-toggle uk-light" uk-slider>
                    <ul class="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m">
                        <!--<li v-for="img in fb.images">-->
                            <img :src="fb.images" alt="">
                        <!--</li>-->
                    </ul>
                    <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#"
                       uk-slidenav-previous uk-slider-item="previous"
                    ></a>
                    <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#"
                       uk-slidenav-next uk-slider-item="next"
                    ></a>
                </div>
                <div class="uk-comment-meta uk-margin-top">
                    Created by: <b>{{ fb.owner }}</b> {{ (new Date(fb.created)).toLocaleString("ru") }}
                </div>
            </article>
        </div>
    </li>
</ul>
</span>
</template>

<script>
export default {
    name: 'AllFB',

    data () {
        return {
            loading: false,
            error: null,
            feedbacks: [],
            showBrandInfo: false,
            collapse: false
        }
    },

    props: ['brandName'],

    created () {
        this.fetchData();
//        console.log(this.nprogress)
//        this.nprogress.start();
//        setTimeout(this.nprogress.done, 3000)
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        fetchData () {
            this.error = null;
            this.loading = true;
            this.$http.get('/api/feedbacks/' + this.brandName + '/')
                .then(response => {
                    this.$store.commit('SET_BRAND_FEEDBACKS', {
                        name: this.$route.params.name,
                        items: response.data
                    });
                    this.feedbacks = response.data;
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false;
                    this.error = error.response.data
                })
        },
        toggleAccordion () {
            this.collapse = !this.collapse;
            const acc = UIkit.accordion(accordion);
            for (let item of acc.items) {
                if (this.collapse && item.className != 'uk-open') {
                    UIkit.accordion(accordion).toggle(acc.items.indexOf(item))
                }
                if (!this.collapse && item.className == 'uk-open') {
                    UIkit.accordion(accordion).toggle(acc.items.indexOf(item))
                }
            }
        }
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
