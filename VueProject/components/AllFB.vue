<template>
<vk-grid gutter="large">
    <!--Menu-->
    <div class="uk-width-1-4@m">
        <vk-sticky top="#navbar" :offset="100" media="@m">
            <vk-card padding="small" class="uk-background-muted">
                <search class="uk-margin-top"></search>
            </vk-card>
        </vk-sticky>
    </div>

    <!--Feedbackes-->
    <div class="uk-width-3-4@m">
        <!--Add feedback or Show all feedbacks section-->
        <router-view class="uk-margin-medium-bottom"></router-view>
    </div>
</vk-grid>
</template>

<script>
import Search from './Search.vue'
import FBList from './FBList.vue'
export default {
    name: 'AllFB',

    components: { Search, FBList },

//    props:

    data () {
        return {

        }
    }
}
</script>
