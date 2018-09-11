<template>
<vk-modal :show="show" center size="medium">
    <vk-tabs :activeTab.sync="activeTab" align="justify" :active="account.showEditPassword ? 1:0">
        <vk-tabs-item :title="$t('Change username')" v-vk-margin>
            <vk-grid gutter="small" class="uk-child-width-1-1 uk-flex-center uk-text-center">
                <div>
                    <form ref="form3">
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: user"></span>
                            <input class="uk-input uk-form-small" name="login"
                                   type="text" :placeholder="$t('new username')"
                                   v-model="newUsername"
                            >
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password"
                                   type="password" :placeholder="$t('password')"
                                   v-model="newPassword"
                            >
                        </div>
                    </form>
                </div>
            </vk-grid>
        </vk-tabs-item>
        <vk-tabs-item :title="$t('Change password')" v-vk-margin>
            <vk-grid gutter="small" class="uk-child-width-1-1 uk-flex-center uk-text-center">
                <div class="uk-margin-top">
                    <form ref="form3">
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password"
                                   type="password" :placeholder="$t('new password')"
                                   v-model="newPassword"
                            >
                        </div>
                        <div class="uk-inline uk-margin-small-bottom">
                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                            <input class="uk-input uk-form-small" name="password2"
                                   type="password" :placeholder="$t('confirm password')"
                                   v-model="newPassword2"
                            >
                        </div>
                    </form>
                </div>
                <div class="uk-margin-top uk-text-meta uk-text-left">*{{ $t('pass8') }}</div>
            </vk-grid>
        </vk-tabs-item>
    </vk-tabs>
    <div slot="footer" class="uk-clearfix">
        <vk-button size="small" class="uk-float-left"
                   @click="account.showEditUsername=false; account.showEditPassword=false"
        >{{ $t('cancel') }}</vk-button>
        <vk-button type="primary" size="small"
                   class="uk-float-right" :disabled="isValid"
                   @click="change()"
        >{{ $t('change') }}</vk-button>
    </div>
</vk-modal>
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

    props: ['show'],

    computed: {
        ...mapState({
            account: state => state.account
        })
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
    }
}
</script>

<style>
    div.uk-modal-body { height: 240px; }
</style>
