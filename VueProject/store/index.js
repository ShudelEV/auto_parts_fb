import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from '../../../src/plugins/logger'

import all from './modules/all'
import account from './modules/account'

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        all, account
    },
    // strict: debug,
    // plugins: debug ? [createLogger()] : []
})
