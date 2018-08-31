<template>
<div :class="{ disabled: $store.state.all.loading }">
<!--Collapse button-->
<span class="uk-clearfix">
    <vk-icon-link title="Collapse" class="uk-float-right"
                  :icon="collapse ? 'chevron-up' : 'chevron-down'"
                  @click="toggleAccordion()"
    ></vk-icon-link>
</span>
    <!--Feedbacks section-->
<div v-for="(value, key) in feedbacks($store.state.all.page)">
    <h2 v-if="!brandName" class="uk-heading-divider">{{ key }}</h2>
    <ul uk-accordion="multiple: true" id="accordion" class="uk-list uk-list-divider">
        <!--Feedback-->
        <li v-for="fb in value" :key="fb.id" :id="'fb_' + fb.id">
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
                    <span v-for="i in [1,2,3,4,5]" :key="i"
                         :class="getStarClass(i, fb.stars)"
                          style="font-size: 125%"
                    >★</span>
                </div>
            </a>
            <!--Content-->
            <div class="uk-accordion-content">
                <article class="uk-comment">
                    <!--Feedback text-->
                    <div class="uk-comment-body"><p>{{ fb.description }}</p></div>
                    <!--Images-->
                    <template v-if="fb.images.length">
                        <div uk-grid uk-lightbox="animation: scale" class="uk-margin-top" tt>
                            <ul class="uk-thumbnav" uk-margin>
                                <li v-for="img in fb.images" class="uk-active" uk-margin>
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
                        <ul class="uk-iconnav uk-padding-remove-left">
                            <li class="uk-padding-remove-left">
                                <span>Created by: <b>{{ fb.owner }}</b> {{ (new Date(fb.created)).toLocaleString("ru") }}</span>
                            </li>
                            <!--<template v-if="fb.owner === $store.state.account.name">-->
                                <!--<li class="uk-margin-left"><a @click="" uk-icon="icon: plus"></a></li>-->
                                <!--<li><a href="#" uk-icon="icon: file-edit"></a></li>-->
                                <!--<li><a href="#" uk-icon="icon: trash"></a></li>-->
                            <!--</template>-->
                        </ul>
                    </div>
                </article>
            </div>
        </li>
    </ul>
</div>
    <!--Pagination-->
<vk-pagination v-if="$store.state.all.pageQty > 1" align="left" class="uk-margin-medium-top"
               :page.sync="pageNumber" :perPage="1"
               :total="$store.state.all.pageQty" :range="20"
>
    <vk-pagination-page-prev label="Previous"></vk-pagination-page-prev>
    <vk-pagination-pages></vk-pagination-pages>
    <vk-pagination-page-next label="Next"></vk-pagination-page-next>
</vk-pagination>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'AllFB',

    data () {
        return {
            brandName: this.$route.params.brandName,
            loading: false,
            error: null,
            showBrandInfo: false,
            collapse: false,
            // pagination
            pageNumber: this.page, // load an appropriate page when page is updated
        }
    },

    props: {
        page: { type: Number },
        part_category: { type: String, default: '' },
        part_type: { type: Number },
        stars: { type: Array }
    },

    created () {
        this.$store.commit('DELETE_FB');
        const filter = {
            part_category: this.part_category,
            part_type: this.part_type,
            stars: this.stars
        };
        this.$store.dispatch('getFB', { filter, page: this.page, brandName: this.brandName });
    },

    computed: {
        ...mapState({
            pageInStore: state => state.all.page,
        }),
        ...mapGetters(['feedbacks'])
    },

    watch: {
        pageInStore: function (val) {
            this.pageNumber = val
        },
        pageNumber: function (val) {
            const name = this.brandName ? 'AllFB' : 'AllFBHome';
            const query = { page: val, };
            if (this.part_category) {
                query.part_category = this.part_category;
            }
            if (this.part_type) {
                query.part_type = this.part_type;
            }
            if (this.stars) {
                query.stars = JSON.stringify(this.stars);
            }
            this.$router.push({ name, params: { brandName: this.brandName }, query });
            this.collapse = false;
        }
    },

    beforeRouteUpdate (to, from, next) {
        let qFrom = Object.assign({}, from.query);
        let qTo = Object.assign({}, to.query);
        const page = qTo.page ? Number(qTo.page) : 1;
        const fbs = this.feedbacks(page);
        delete qFrom.page;
        delete qTo.page;
        if (JSON.stringify(qFrom) === JSON.stringify(qTo) && Object.keys(fbs).length) {
            this.$store.state.all.page = page;
        } else {
            const filter = {
                part_category: qTo.part_category ? qTo.part_category : null,
                part_type: qTo.part_type ? qTo.part_type : null,
                stars: qTo.stars ? JSON.parse(qTo.stars) : null
            };
            this.$store.dispatch('getFB', { filter, page, brandName: this.brandName });
        }
        next()
    },

    methods: {
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
        getStarClass (i, stars) {
            let classShadow = '';
            let classAct = '';
            switch (stars) {
                case 1:
                    classShadow = "red-star-shadow";
                    classAct = "fill-red-star";
                    break;
                case 2:
                case 3:
                    classShadow = "yellow-star-shadow";
                    classAct = "fill-yellow-star";
                    break;
                case 4:
                case 5:
                    classShadow = "green-star-shadow";
                    classAct = "fill-green-star";
                    break;
                default:
                    break;
            }
            return {
                [classShadow]: true,
                [classAct]: i <= stars,
                inactive: i > stars
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
    .inactive { color: #fafafa; }
    .red-star-shadow { text-shadow: 0 0 0.3em #ff0023; }
    .fill-red-star { color: #ff0023; }
    .yellow-star-shadow { text-shadow: 0 0 0.3em #ece514; }
    .fill-yellow-star { color: #ffdd00; }
    .green-star-shadow { text-shadow: 0 0 0.3em #91E500; }
    .fill-green-star { color: #1fe500; }

    .disabled {
        opacity: .5;
        pointer-events: none;
    }
</style>
