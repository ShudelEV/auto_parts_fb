import Vue from 'vue'

const state = {
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    isAnonymous: true,
    error: [],
};

const getters = {
};

const actions = {
    // sig up with email (login) and password
    registerWithEmailAndPassword ({ dispatch, commit }, { form, show }) {
        Vue.axios.post(
            '/auth/users/create/',
            { 'username': form.username, 'password': form.password }
        ).then(
            response => { dispatch('getToken', { form: form, show: show }) }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // log in
    getToken ({ commit, dispatch }, { form, show }) {
        Vue.axios.post(
                '/auth/token/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                commit('SET_SESSION', response);
                // get a user information
                dispatch('getUser');
                // close the login window
                show();
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
    // log out
    destroyToken ({ commit }) {
        Vue.axios.post('/auth/token/destroy/').then(
            () => { commit('REMOVE_USER') }
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
    },
    REMOVE_USER (state) {
        state.id = null;
        state.name = null;
        state.email = null;
        state.isAnonymous = true;
        state.isAuthenticated = false;
        localStorage.removeItem('expires_at');
        localStorage.removeItem('auth_token');
        delete Vue.axios.defaults.headers.common['Authorization'];
    },
    HANDLE_ERROR (state, error) {
        if (error.response) {
            for (let i in error.response.data) {
                for (let m of error[i]) {
                    state.error.push(m)
                }
            }
        }
    },
    SET_ERROR (state, error) {
        state.error = error
    },
    SET_SESSION (state, response) {
        // console.log(response.headers.date)
        let date = new Date(response.headers.date);
        // add 30 days
        date.setDate(date.getDate() + 30);
        localStorage.setItem('expires_at', JSON.stringify(date));
        localStorage.setItem('auth_token', response.data.auth_token);
        // set axios default config
        Vue.axios.defaults.headers.common['Authorization'] = 'Token ' + response.data.auth_token;
        state.isAnonymous = false;
        state.isAuthenticated = true;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
