<template>
<div class="uk-container">
    <div class="uk-position-relative">
        <img src="/static/images/header.jpeg" alt="">
        <div class="uk-position-top">
            <vk-sticky>
                <vk-navbar transparent class="uk-navbar-sticky">
                    <vk-navbar-nav>
                        <vk-navbar-logo>AutoParts</vk-navbar-logo>
                    </vk-navbar-nav>
                    <vk-navbar-nav slot="right">
                        <vk-navbar-item>
                            <form>
                                <div class="uk-inline">
                                    <input class="uk-input uk-form-width-small uk-form-small uk-margin-small-right"
                                            type="text" placeholder="Login">
                                </div>
                                <input class="uk-input uk-form-width-small uk-form-small uk-margin-small-right"
                                       type="text" placeholder="Password">
                                <vk-button class="uk-button-small">Login</vk-button>
                            </form>
                        </vk-navbar-item>
                    </vk-navbar-nav>
                </vk-navbar>
            </vk-sticky>
        </div>
    </div>
    <div class="uk-section uk-section-default uk-section-xsmall">
        <!--<div class="uk-container">-->
            <vk-grid gutter="large">
                <div class="uk-width-1-4@m">
                    <vk-card>Menu</vk-card>
                </div>
                <div class="uk-width-expand@m">
                    <vk-grid gutter="small" class="uk-child-width-expand@s uk-text-center">
                        <div>
                            <vk-card hover>Item1</vk-card>
                        </div>
                        <div>
                            <vk-card hover>Item2</vk-card>
                        </div>
                        <div>
                            <vk-card hover>Item3</vk-card>
                        </div>
                        <div>
                            <vk-card hover>Item4</vk-card>
                        </div>
                    </vk-grid>
                </div>
            </vk-grid>
        <!--</div>-->
        <!--<router-view></router-view>-->
    </div>
</div>
</template>

<script>
export default {
    name: 'App',

    components: {  },

    data () {
        return {
        }
    }
}
</script>
