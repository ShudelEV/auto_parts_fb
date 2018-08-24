<template>
<vk-modal :show="show" center size="medium">
    <vk-tabs :activeTab.sync="activeTab" align="justify" active="1">
        <vk-tabs-item title="Sig In" v-vk-margin>
            <vk-grid gutter="small" class="uk-child-width-1-1 uk-flex-center uk-text-center">
                <div class="uk-margin-small-top">
                    <a title="VKontakte" @click="$store.dispatch('registerWithSocial', 'vk-oauth2')">
                        <img src="/static/images/social-icon/vk.svg" alt="" height="36" width="36" uk-svg
                          class="uk-border-rounded uk-margin-small-right">
                    </a>
                    <a title="Facebook" @click="$store.dispatch('registerWithSocial', 'facebook-oauth2')">
                        <img src="/static/images/social-icon/facebook.svg" alt="" height="36" width="36" uk-svg
                          class="uk-border-rounded uk-margin-small-right">
                    </a>
                    <a title="Twitter" @click="$store.dispatch('registerWithSocial', 'twitter-oauth')">
                        <img src="/static/images/social-icon/twitter.svg" alt="" height="36" width="36" uk-svg
                          class="uk-border-rounded uk-margin-small-right">
                    </a>
                    <a title="Google+" @click="$store.dispatch('registerWithSocial', 'google-oauth2')">
                        <img src="/static/images/social-icon/google-plus.svg" alt="" height="36" width="36" uk-svg
                          class="uk-border-rounded">
                    </a>
                </div>
                <div>OR</div>
                <div>
                    <form ref="form">
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: user"></span>
                            <input class="uk-input uk-form-small" name="login"
                                   type="text" placeholder="Login"
                                   v-model="username"
                            >
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password"
                                   type="password" placeholder="Password"
                                   v-model="password"
                            >
                        </div>
                    </form>
                </div>
            </vk-grid>
        </vk-tabs-item>
        <vk-tabs-item title="Sign Up" v-vk-margin>
            <vk-grid gutter="small" class="uk-child-width-1-1 uk-flex-center uk-text-center">
                <div class="uk-margin-top">
                    <form ref="form">
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: user"></span>
                            <input class="uk-input uk-form-small" name="login"
                                   type="text" placeholder="Login"
                                   v-model="username"
                            >
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password"
                                   type="password" placeholder="Password"
                                   v-model="password"
                            >
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password2"
                                   type="password" placeholder="Confirm password"
                                   v-model="password2"
                            >
                        </div>
                    </form>
                </div>
                <div class="uk-margin-top uk-text-meta uk-text-left">*Password must be at list 8 characters</div>
            </vk-grid>
        </vk-tabs-item>
    </vk-tabs>
    <div slot="footer" class="uk-clearfix">
        <vk-button size="small" class="uk-float-left"
                   @click="account.showLoginWindow = false"
        >Cancel</vk-button>
        <vk-button type="primary" size="small"
                   class="uk-float-right" :disabled="isValid"
                   @click="login"
        >{{!activeTab ? 'Login' : 'Reg' }}</vk-button>
    </div>
</vk-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'LoginWindow',

    data () {
        return {
            username: '',
            password: '',
            password2: '',
            isValid: false,
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
        checkForm () {
            if (this.username === '') {
                this.$store.commit('SET_WARNING', 'Login is REQUIRED');
                this.highlightInput('login')
            } else if (this.password === '') {
                this.$store.commit('SET_WARNING', 'Password is REQUIRED');
                this.highlightInput('password')
            } else if (this.password.length < 8) {
                this.$store.commit('SET_WARNING', 'Password less then 8 characters');
                this.highlightInput('password')
            } else if (this.activeTab && this.password2 !== this.password) {
                this.$store.commit('SET_WARNING', 'Confirm Password');
                this.highlightInput('password2')
            } else {
                return true
            }
            return false
        },
        highlightInput (elName) {
            let element = this.$refs.form[elName];
            element.classList.toggle("uk-form-danger");
            setTimeout(() => { element.classList.toggle("uk-form-danger") }, 2000)
        },
        register () {
            const form = this.$refs.form.elements;
            this.$store.dispatch('registerWithEmailAndPassword', {
                form: {
                    'username': form.login.value,
                    'password': form.password.value
                }
            })
        },
        login () {
            if (this.checkForm()) {
                const form = {
                    'username': this.username,
                    'password': this.password
                };
                this.activeTab ?
                    this.$store.dispatch('registerWithEmailAndPassword', { form }) : this.$store.dispatch('getToken', { form })

            }
        }
    }
}
</script>

<style>
    div.uk-modal-body { height: 240px; }
</style>
