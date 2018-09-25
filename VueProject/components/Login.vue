<template>
<div id="modal-login" ref="loginWindow" class="uk-flex-top" uk-modal="bg-close: false">
    <div class="uk-modal-dialog uk-width-medium uk-margin-auto-vertical">
        <div class="uk-modal-body">
            <ul class="uk-flex-center" uk-tab>
                <li><a @click="activeTab=0">{{ $t('sign in') }}</a></li>
                <li><a @click="activeTab=1">{{ $t('sign up') }}</a></li>
            </ul>
            <ul class="uk-switcher uk-margin-medium-top">
                <li>
                    <div class="uk-grid-small uk-child-width-1-1 uk-flex-center uk-text-center" uk-grid>
                        <div class="">
                            <a title="VKontakte" @click="regWithSocial('vk-oauth2')">
                                <img src="/static/images/social-icon/vk.svg" alt="" height="36" width="36" uk-svg
                                  class="uk-border-rounded uk-margin-small-right">
                                <!--<img :src="staticUrl + 'images/social-icon/vk.svg'" alt="" height="36" width="36" uk-svg-->
                                  <!--class="uk-border-rounded uk-margin-small-right">-->
                            </a>
                            <a title="Facebook" @click="regWithSocial('facebook-oauth2')">
                                <img src="/static/images/social-icon/facebook.svg" alt="" height="36" width="36" uk-svg
                                  class="uk-border-rounded uk-margin-small-right">
                                <!--<img :src="staticUrl + 'images/social-icon/facebook.svg'" alt="" height="36" width="36" uk-svg-->
                                  <!--class="uk-border-rounded uk-margin-small-right">-->
                            </a>
                            <a title="Twitter" @click="regWithSocial('twitter-oauth')">
                                <img src="/static/images/social-icon/twitter.svg" alt="" height="36" width="36" uk-svg
                                  class="uk-border-rounded uk-margin-small-right">
                                <!--<img :src="staticUrl + 'images/social-icon/twitter.svg'" alt="" height="36" width="36" uk-svg-->
                                  <!--class="uk-border-rounded uk-margin-small-right">-->
                            </a>
                            <a title="Google+" @click="regWithSocial('google-oauth2')">
                                <img src="/static/images/social-icon/google-plus.svg" alt="" height="36" width="36" uk-svg
                                  class="uk-border-rounded">
                                <!--<img :src="staticUrl + 'images/social-icon/google-plus.svg'" alt="" height="36" width="36" uk-svg-->
                                  <!--class="uk-border-rounded">-->
                            </a>
                        </div>
                        <div>{{ $t('or') }}</div>
                        <div>
                            <form ref="form">
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                                    <input class="uk-input uk-form-small" name="login"
                                           type="text" :placeholder="$t('username')"
                                           v-model="username"
                                    >
                                </div>
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                                    <input class="uk-input uk-form-small" name="password"
                                           type="password" :placeholder="$t('password')"
                                           v-model="password"
                                    >
                                </div>
                            </form>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="uk-grid-small uk-child-width-1-1 uk-flex-center uk-text-center">
                        <div class="">
                            <form ref="form2">
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="icon: user"></span>
                                    <input class="uk-input uk-form-small" name="login"
                                           type="text" :placeholder="$t('username')"
                                           v-model="username"
                                    >
                                </div>
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                                    <input class="uk-input uk-form-small" name="password"
                                           type="password" :placeholder="$t('password')"
                                           v-model="password"
                                    >
                                </div>
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="icon: lock"></span>
                                    <input class="uk-input uk-form-small" name="password2"
                                           type="password" :placeholder="$t('confirm password')"
                                           v-model="password2"
                                    >
                                </div>
                            </form>
                        </div>
                        <div class="uk-margin-top uk-text-meta uk-text-left">*{{ $t('pass8') }}</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="uk-modal-footer uk-clearfix">
            <button class="uk-button uk-button-default uk-button-small uk-float-left"
                    @click="closeWindow()"
            >{{ $t('cancel') }}</button>
            <button class="uk-button uk-button-primary uk-button-small uk-float-right"
                    :disabled="isValid"
                    @click="login()"
            >{{!activeTab ? $t('login') : $t('registr') }}</button>
        </div>
    </div>
</div>
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

    computed: {
        ...mapState({
            staticUrl: state => state.all.staticUrl
        })
    },

    methods: {
        checkForm () {
            if (this.username === '') {
                this.$store.commit('SET_WARNING', 'Username is REQUIRED');
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
            let element = this.activeTab ? this.$refs.form2[elName] : this.$refs.form[elName];
            element.classList.toggle("uk-form-danger");
            setTimeout(() => { element.classList.toggle("uk-form-danger") }, 2000)
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
        },
        regWithSocial (provider) {
            sessionStorage.setItem('social_redirect_url', this.$route.fullPath);
            this.$store.dispatch('registerWithSocial', provider)
        },
        closeWindow () {
            UIkit.modal(this.$refs.loginWindow).hide()
        }
    }
}
</script>

<style>
    div.uk-modal-body { height: 240px; }
</style>
