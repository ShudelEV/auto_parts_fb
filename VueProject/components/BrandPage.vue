<template>
<vk-grid gutter="large">
    <!--BrandInfo window-->
    <vk-modal-full :show.sync="showBrandInfo">
        <vk-modal-full-close large></vk-modal-full-close>
        <brand-info :name="brandName"></brand-info>
    </vk-modal-full>
    <!--Menu-->
    <!--<vk-sticky>-->
    <div class="uk-width-1-4@m uk-margin">
        <h2>{{brandName}}</h2>
        <ul class="uk-iconnav">
            <li><vk-icon-link icon="info" @click="showBrandInfo=true" title="Info"></vk-icon-link></li>
            <li v-if="$route.name != 'AddFB'">
                <vk-icon-link icon="plus-circle"
                              @click="$router.push({ name: 'AddFB' })"
                              title="Add feedback"
                ></vk-icon-link>
            </li>
        </ul>
    </div>
    <!--</vk-sticky>-->
    <!--Feedbackes-->
    <div class="uk-width-3-4@m uk-margin">
        <!--Add feedback or Show all feedbacks section-->
        <router-view :brandName="brandName" class="uk-margin-medium-bottom"></router-view>
    </div>
</vk-grid>
</template>

<script>
import BrandInfo from './BrandInfo.vue'

export default {
    name: 'BrandPage',

    components: { BrandInfo },

    data () {
        return {
            loading: false,
            error: null,
            brandName: '',
            showBrandInfo: false
        }
    },

    created () {
        this.fetchData();
        // when window is updated (F5)
        this.brandName = this.$route.params.name;
        this.$router.push({ name: 'AllFB' })
    },

    watch: {
        '$route': 'fetchData'
    },

    methods: {
        fetchData () {
        }
    }
}
</script>
