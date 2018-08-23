<template>
<!--<div>-->
<vk-modal :show="show" center size="medium">
    <vk-tabs :activeTab.sync="activeTab" align="justify" active="1">
        <vk-tabs-item title="Sig In" v-vk-margin>
            <vk-grid gutter="small" class="uk-child-width-1-1 uk-flex-center uk-text-center">
                <div>
                    <vk-icon-button icon="twitter" class="uk-margin-small-right"
                                    style="background-color: aliceblue; color: cyan"
                                    title="Login with Twitter"
                                    @click="$store.dispatch('registerWithSocial', 'google-oauth2')"
                    ></vk-icon-button>
                    <vk-icon-button icon="vimeo" class="uk-margin-small-right"
                                    style="background-color: aliceblue; color: darkslateblue"
                                    title="Login with VK"
                                    @click="$store.dispatch('registerWithSocial', 'vk-oauth2')"
                    ></vk-icon-button>
                    <vk-icon-button icon="google"
                                    style="background-color: aliceblue; color: #34a853"
                                    title="Login with Google"
                                    @click="$store.dispatch('registerWithSocial', 'google-oauth2')"
                    ></vk-icon-button>
                </div>
                <div>OR</div>
                <div>
                    <form ref="form">
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: user"></span>
                            <input class="uk-input uk-form-small" name="login" type="text">
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password" type="password">
                        </div>
                    </form>
                </div>
            </vk-grid>
        </vk-tabs-item>
        <vk-tabs-item title="Sign Up" v-vk-margin>
            <vk-grid gutter="small" class="uk-child-width-1-1 uk-flex-center uk-text-center">
                <div>
                    <form ref="form">
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: user"></span>
                            <input class="uk-input uk-form-small" name="login" type="text">
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password" type="password">
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password2" type="password">
                        </div>
                    </form>
                </div>
            </vk-grid>
        </vk-tabs-item>
    </vk-tabs>
    <div slot="footer" class="uk-clearfix">
        <vk-button @click="account.showLoginWindow = false" size="small" class="uk-float-left">Cancel</vk-button>
        <vk-button v-if="activeTab == 0" @click="login()" type="primary" size="small" class="uk-float-right">Login</vk-button>
        <vk-button v-else @click="register()" type="primary" size="small" class="uk-float-right">Reg</vk-button>
    </div>
</vk-modal>
<!--</div>-->
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    name: 'LoginWindow',

    data () {
        return {
            activeTab: 0
        }
    },

    props: ['show'],

    computed: {
        ...mapState({
            account: state => state.account
        })
    },

    methods: {
        register () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('registerWithEmailAndPassword', {
                form: {
                    'username': form.login.value,
                    'password': form.password.value
                }
            })
        },
        // get token
        login () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('getToken', {
                form: {
                    'username': form.login.value,
                    'password': form.password.value
                }
            })
        }
    }
}
</script>

<style>
    div.uk-modal-body { height: 240px; }
</style>
