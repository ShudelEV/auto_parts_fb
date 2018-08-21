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
    <li v-for="fb in feedbacks" :key="fb.id" :id="'fb_' + fb.id">
        <!--Header-->
        <a class="uk-accordion-title" href="#">
            <!--Part name-->
            <vk-icon icon="cog"></vk-icon> {{ fb.part.type }}
            <!--Car name-->
            <div v-if="fb.part.car" class="uk-display-inline-block">
                <vk-icon-image src="/static/images/car.svg" uk-svg class="uk-margin-small-left"></vk-icon-image>
                {{ fb.part.car.model }}
                {{ fb.part.car.manufacture_year ? ' ' + fb.part.car.manufacture_year + ' m.y.' : '' }}
                {{ fb.part.car.engine_volume ? ' ' + fb.part.car.engine_volume + ' cm3' : '' }}
            </div>
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
                <template v-if="fb.images.length">
                    <div uk-grid uk-lightbox="animation: scale" class="uk-margin-top">
                        <ul class="uk-thumbnav" uk-margin>
                            <li v-for="img in fb.images" class="uk-thumbnav" uk-margin>
                                <a class="uk-inline" :href="img.image"
                                   :data-caption="img.description ? img.description : ''"
                                >
                                    <img :src="img.image" width="100" height="100" alt="">
                                </a>
                            </li>
                        </ul>
                    </div>
                </template>
                <div class="uk-comment-meta uk-margin-top">
                    Created by: <b>{{ fb.owner }}</b> {{ (new Date(fb.created)).toLocaleString("ru") }}
                </div>
            </article>
        </div>
    </li>
</ul>
    <!--Pagination-->
<vk-pagination v-if="total > 1" align="left" :page.sync="page" :perPage="1" :total="total" :range="20">
    <vk-pagination-page-prev label="Previous"></vk-pagination-page-prev>
    <vk-pagination-pages></vk-pagination-pages>
    <vk-pagination-page-next label="Next"></vk-pagination-page-next>
</vk-pagination>
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
            collapse: false,
            // pagination
            page: Number(this.page_number), // load an appropriate page when page is updated
            total: 1,
            // number of items on a page
            page_size: 20
        }
    },

    props: ['brandName', 'page_number'],

    created () {
        // update feedbacks in store
        this.$store.commit('DELETE_FB');
        this.fetchData(this.page);
    },

    watch: {
        // if click Previous or Next
//        page_number: function (val) {
//            if (this.page != Number(val)) { this.page = Number(val) }
//        },
        page: function (val) {
            this.$router.push({ name: 'AllFB', params: { brandName: this.brandName, page_number: val } });
            this.collapse = false;
        }
    },

    beforeRouteUpdate (to, from, next) {
        let fb = this.$store.getters.getFB({
            brandName: this.brandName,
            pageNumber: to.params.page_number
        });
//        console.log(fb, typeof to.params.page_number)
        if (fb) {
            this.feedbacks = fb
        } else {
            this.fetchData(this.page)
        }
        next()
    },

    methods: {
        fetchData (page) {
            this.error = null;
            this.loading = true;
            let url = '/api/' + this.brandName + '/feedbacks/';
            if (this.page != 1) {
                url += '?page=' + this.page
            }
            this.$http.get(url)
                .then(response => {
                    this.$store.commit('SET_BRAND_FEEDBACKS', {
                        brandName: this.brandName,
                        items: response.data.results,
                        page_number: this.page_number
                    });
                    let pageQty = response.data.count / this.page_size;
                    let roundPageQty = Math.trunc(pageQty);
                    this.total = pageQty == roundPageQty ? roundPageQty : roundPageQty + 1;
                    this.feedbacks = response.data.results;
                    this.loading = false;
                    this.highlightFB()
                })
                .catch(error => {
                    this.loading = false;
                    if (error.response) {
                        this.error = error.response.data
                    } else {
                        this.error = error
                    }

                })
        },
        toggleAccordion () {
            this.collapse = !this.collapse;
            const acc = UIkit.accordion(accordion);
            for (let item of acc.items) {
                if (this.collapse && item.className != 'uk-open') {
                    acc.toggle(acc.items.indexOf(item))
                }
                if (!this.collapse && item.className == 'uk-open') {
                    acc.toggle(acc.items.indexOf(item))
                }
            }
        },
        // highlight feedback if created
        highlightFB () {
            const fb_id = this.$store.state.all.newFBId;
            if (fb_id) {
                setTimeout(() => {
                    const element = document.getElementById('fb_' + fb_id);
                    const acc = UIkit.accordion(accordion);
                    acc.toggle(acc.items.indexOf(element));
                    element.style.backgroundColor = 'honeydew'
                }, 1000);
                setTimeout(() => {
                    document.getElementById('fb_' + fb_id).style.backgroundColor = "";
                    this.$store.state.all.newFBId = null
                }, 2500)
            }
        }
    }
}
</script>

<style>
    .uk-icon svg[meta='vk-icons-star'] { color: gold; }
    .uk-icon.fill-star svg[meta='vk-icons-star'] polygon { fill: #fdff00; }
</style>
