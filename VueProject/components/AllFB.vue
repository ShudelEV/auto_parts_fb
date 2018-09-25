<template>
<div class="uk-grid-large" uk-grid>
    <!--Menu-->
    <div class="uk-width-1-4@m">
        <div uk-sticky="top: #navbar; offset: 100" media="@m">
            <div class="uk-card uk-card-small uk-card-default uk-card-body uk-background-muted"
                 :class="{'uk-margin-top': showOnUp(), 'disabled-content': $store.state.all.loading}"
            >
                <search></search>
            </div>
        </div>
    </div>

    <!--Feedbackes-->
    <div class="uk-width-3-4@m">
        <!--Add feedback or Show all feedbacks section-->
        <router-view class="uk-margin-medium-bottom"></router-view>
    </div>
</div>
</template>

<script>
import Search from './Search.vue'
import FBList from './FBList.vue'

export default {
    name: 'AllFB',

    components: { Search, FBList },

    data () {
        return {
        }
    },

    mounted () {
        this.$nextTick(() => { this.$store.commit('SET_ELEMENTS_HEIGHT') })
    },

    methods: {
        showOnUp () {
            return (window.innerWidth <= 960)
        }
    }
}
</script>
