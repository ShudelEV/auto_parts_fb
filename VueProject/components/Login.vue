<template>
<div>
<vk-modal :show="show" center size="medium">
    <vk-tabs :activeTab.sync="activeTab" align="justify" active="1">
        <vk-tabs-item title="Sig In" v-vk-margin>
            <div class="uk-margin-left">
                <vk-icon-button href="#" class="uk-margin-small-right" icon="twitter"></vk-icon-button>
                <vk-icon-button href="#" class="uk-margin-small-right" icon="facebook"></vk-icon-button>
                <vk-icon-button href="/auth/o/login/google-oauth2/" icon="google"></vk-icon-button>
            </div>
            <div class="uk-text-center">OR</div>
            <form ref="form" class="uk-margin-left">
                <div class="uk-inline uk-margin-small-bottom">
                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                    <input class="uk-input uk-form-small" name="login" type="text">
                </div>
                <div class="uk-inline uk-margin-small-bottom">
                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                    <input class="uk-input uk-form-small" name="password" type="password">
                </div>
            </form>
        </vk-tabs-item>
        <vk-tabs-item title="Sign Up">

        </vk-tabs-item>
    </vk-tabs>
    <div slot="footer" class="uk-clearfix">
        <vk-button @click="account.showLoginWindow = false" size="small" class="uk-float-left">Cancel</vk-button>
        <vk-button v-if="activeTab == 0" @click="login()" type="primary" size="small" class="uk-float-right">Login</vk-button>
        <vk-button v-else @click="register()" type="primary" size="small" class="uk-float-right">Reg</vk-button>
    </div>
</vk-modal>
</div>
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
