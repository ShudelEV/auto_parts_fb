import Vue from 'vue'

const state = {
    showLoginWindow: false,
    showSuggestLogin: false,
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    isAnonymous: true,
    message: []
};

const getters = {
};

const actions = {
    // sig up with email (login) and password
    registerWithEmailAndPassword ({ dispatch, commit }, { form}) {
        Vue.axios.post(
            '/auth/users/create/',
            { 'username': form.username, 'password': form.password }
        ).then(
            response => { dispatch('getToken', { form: form }) }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // log in
    getToken ({ state, commit, dispatch }, { form }) {
        Vue.axios.post(
                '/auth/token/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                commit('SET_SESSION', response);
                // set axios default config
                Vue.axios.defaults.headers.common['Authorization'] = 'Token ' + response.data.auth_token;
                // get a user information
                dispatch('getUser');
                // close the login window
                state.showLoginWindow = false;
                state.showSuggestLogin = false;
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // get user information
    getUser ({ commit }) {
        Vue.axios.get('/auth/me/').then(
            response => commit('SET_USER', response.data)
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // create anonymous user
    registerAnonymousUser ({ dispatch, commit }, callBack) {
        Vue.axios.get('/auth/users/create-anonymous/')
            .then(
                response => {
                    dispatch('getTokenAnonymousUser', { form: response.data, callBack: callBack });
                })
            .catch(
                error => commit('HANDLE_ERROR', error)
            )
    },
    // log in
    getTokenAnonymousUser ({ state, commit, dispatch }, { form, callBack }) {
        Vue.axios.post(
                '/auth/token/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                commit('SET_SESSION_ANONYMOUS_USER', response);
                localStorage.setItem('anonymous_user_name', form.username);
                localStorage.setItem('anonymous_user_password', form.password);
                // set axios default config
                Vue.axios.defaults.headers.common['Authorization'] = 'Token ' + response.data.auth_token;
                // send FB
                callBack()
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // log out
    destroyToken ({ state, commit }) {
        Vue.axios.post('/auth/token/destroy/').then(
            () => {
                commit('REMOVE_USER');
                state.showSuggestLogin = false;
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    }
};

const mutations = {
    SET_USER (state, user) {
        state.id = user.id;
        state.name = user.username;
        state.email = user.email;
        state.isAnonymous = false;
        state.isAuthenticated = true;
    },
    REMOVE_USER (state) {
        state.id = null;
        state.name = null;
        state.email = null;
        state.isAnonymous = true;
        state.isAuthenticated = false;
        localStorage.removeItem('expires_at');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('anonymous_user_auth_token');
        localStorage.removeItem('anonymous_user_name');
        localStorage.removeItem('anonymous_user_password');
        delete Vue.axios.defaults.headers.common['Authorization'];
    },
    SET_SESSION (state, response) {
        let date = new Date(response.headers.date);
        // add 30 days
        date.setDate(date.getDate() + 30);
        localStorage.setItem('expires_at', JSON.stringify(date));
        localStorage.setItem('auth_token', response.data.auth_token)
    },
    SET_SESSION_ANONYMOUS_USER (state, response) {
        let date = new Date(response.headers.date);
        // add 1 year
        date.setDate(date.getDate() + 365);
        localStorage.setItem('expires_at', JSON.stringify(date));
        localStorage.setItem('anonymous_user_auth_token', response.data.auth_token);
        state.isAnonymous = true;
        state.isAuthenticated = true;
    },
    HANDLE_ERROR (state, error) {
        if (error.response) {
            // console.log(error.response.data)
            let err_data = error.response.data;
            for (let i in err_data) {
                for (let m of err_data[i]) {
                    const message = i == 'non_field_errors' ? m : (i + ': ' + m);
                    state.message.push({message: message, status: 'danger' })
                }
            }
        }
    },
    SET_ERROR (state, error) {
        state.message.push({ message: error, status: 'danger' })
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
