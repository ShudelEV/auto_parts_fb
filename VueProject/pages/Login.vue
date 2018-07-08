<template>
<vk-modal show center overflow-auto size="medium">
    <!--Error notification-->
    <vk-notification :messages.sync="account.error" status="danger"></vk-notification>
    <vk-modal-close @click="goBack()"></vk-modal-close>
    <vk-tabs align="justify">
        <vk-tabs-item title="Sig In" class="uk-margin">
            <div class="uk-margin-auto">
                <vk-icon-button href="#" class="uk-margin-small-right" icon="twitter"></vk-icon-button>
                <vk-icon-button href="#" class="uk-margin-small-right" icon="facebook"></vk-icon-button>
                <vk-icon-button href="#" icon="google-plus"></vk-icon-button>
            </div>
            <div class="uk-text-center">OR</div>
            <form ref="form" >
                <div class="uk-inline uk-margin-small-bottom">
                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                    <input class="uk-input uk-form-small"
                           name="login"
                           type="text">
                </div>
                <div class="uk-inline uk-margin-small-bottom">
                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                    <input class="uk-input uk-form-small"
                           name="password"
                           type="password">
                </div>
            </form>
            <vk-icon-link @click="login()" icon="sign-in" class="uk-margin-auto-left"></vk-icon-link>
        </vk-tabs-item>
        <vk-tabs-item title="Sign Up">

        </vk-tabs-item>
    </vk-tabs>
</vk-modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    // name: 'LoginWindow',

    components: {  },

    data () {
        return {
        }
    },

    computed: {
        ...mapState({
            account: state => state.account
        })
    },

    methods: {
        goBack () {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
        register () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('registerWithEmailAndPassword', {
                'username': form.login.value,
                'password': form.password.value
            })
        },
        // get token
        login () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('getToken', {
                'username': form.login.value,
                'password': form.password.value
            })
        },
        logout () {
            this.$store.dispatch('destroyToken')
        }
    }
}
</script>
