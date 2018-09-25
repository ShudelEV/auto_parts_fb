<template>
<div id="modal-login-edit" ref="editLoginWindow" class="uk-flex-top" uk-modal="bg-close: false">
    <div class="uk-modal-dialog uk-width-medium uk-margin-auto-vertical">
        <div class="uk-modal-body">
            <ul uk-tab>
                <li><a @click="activeTab=0">{{ $t('Change username') }}</a></li>
                <li><a @click="activeTab=1">{{ $t('Change password') }}</a></li>
            </ul>
            <ul class="uk-switcher uk-margin-medium-top">
                <li>
                    <div class="uk-grid-small uk-child-width-1-1 uk-flex-center uk-text-center" uk-grid>
                        <div>
                            <form ref="form3">
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="user"></span>
                                    <input class="uk-input uk-form-small" name="login"
                                           type="text" :placeholder="$t('new username')"
                                           v-model="newUsername"
                                    >
                                </div>
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="lock"></span>
                                    <input class="uk-input uk-form-small" name="password"
                                           type="password" :placeholder="$t('password')"
                                           v-model="newPassword"
                                    >
                                </div>
                            </form>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="uk-grid-small uk-child-width-1-1 uk-flex-center uk-text-center" uk-grid>
                        <div class="uk-margin-top">
                            <form ref="form3">
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="lock"></span>
                                    <input class="uk-input uk-form-small" name="password"
                                           type="password" :placeholder="$t('new password')"
                                           v-model="newPassword"
                                    >
                                </div>
                                <div class="uk-inline uk-margin-small-bottom">
                                    <span class="uk-form-icon" uk-icon="lock"></span>
                                    <input class="uk-input uk-form-small" name="password2"
                                           type="password" :placeholder="$t('confirm password')"
                                           v-model="newPassword2"
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
                @click="change()"
        >{{ $t('change') }}</button>
    </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'EditAccount',

    data () {
        return {
            newUsername: '',
            newPassword: '',
            newPassword2: '',
            isValid: false,
            activeTab: 0
        }
    },

    methods: {
        checkForm () {
            if (this.activeTab === 0 && this.newUsername === '') {
                this.$store.commit('SET_WARNING', 'Username is REQUIRED');
                this.highlightInput('login')
            } else if (this.newPassword === '') {
                this.$store.commit('SET_WARNING', 'Password is REQUIRED');
                this.highlightInput('password')
            } else if (this.newPassword.length < 8) {
                this.$store.commit('SET_WARNING', 'Password less then 8 characters');
                this.highlightInput('password')
            } else if (this.activeTab === 1 && this.newPassword2 !== this.newPassword) {
                this.$store.commit('SET_WARNING', 'Confirm Password');
                this.highlightInput('password2')
            } else {
                return true
            }
            return false
        },
        highlightInput (elName) {
            let element = this.$refs.form3[elName];
            element.classList.toggle("uk-form-danger");
            setTimeout(() => { element.classList.toggle("uk-form-danger") }, 2000)
        },
        change () {
            if (this.activeTab === 0 && this.checkForm()) {
                this.$store.dispatch('changeUsername', { new_username: this.newUsername })
            } else if (this.activeTab === 1 && this.checkPasswordForm()) {
                this.$store.dispatch('changePassword', { new_password: this.newPassword })
            }
        },
        closeWindow () {
            UIkit.modal(this.$refs.editLoginWindow).hide()
        }
    }
}
</script>

<style>
    div.uk-modal-body { height: 240px; }
</style>
