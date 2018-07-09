<template>
<vk-modal :show="show" center size="medium">
    <!--Error notification-->
    <vk-notification :messages.sync="account.error" status="danger"></vk-notification>
    <vk-tabs align="justify">
        <vk-tabs-item title="Sig In" v-vk-margin>
            <div class="uk-margin-left">
                <vk-icon-button href="#" class="uk-margin-small-right" icon="twitter"></vk-icon-button>
                <vk-icon-button href="#" class="uk-margin-small-right" icon="facebook"></vk-icon-button>
                <vk-icon-button href="#" icon="google-plus"></vk-icon-button>
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
            <div class="uk-margin-left">
                <vk-button @click="$emit('close')">Cancel</vk-button>
                <vk-button @click="login()">Login</vk-button>
            </div>
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

    props: ['show'],

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
                form: {
                    'username': form.login.value,
                    'password': form.password.value
                },
                show: () => this.$emit('close')
            })
        },
        // get token
        login () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('getToken', {
                form: {
                    'username': form.login.value,
                    'password': form.password.value
                },
                show: () => this.$emit('close')
            })
        }
    }
}
</script>
