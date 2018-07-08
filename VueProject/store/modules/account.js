import axios from 'axios'

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
    registerWithEmailAndPassword ({ dispatch, commit }, form) {
        axios.post(
            '/auth/users/create/',
            { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                // commit('SET_USER', response.data);
                // log in
                dispatch('getToken', form)
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // log in
    getToken ({ commit, dispatch }, form) {
        axios.post(
                '/auth/token/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                commit('SET_SESSION', response);
                dispatch('getUser');
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // get user information
    getUser ({ commit }) {
        axios.get(
            '/auth/me/',
            {
                headers: { Authorization: 'Token ' + localStorage.getItem('auth_token') }
            }
        ).then(
            response => commit('SET_USER', response.data)
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    // log out
    destroyToken ({ commit, state }) {
        axios.post(
            '/auth/token/destroy/',
            { },
            {
                headers: { Authorization: 'Token ' + localStorage.getItem('auth_token') }
            }
        ).then(
            () => {
                localStorage.removeItem('expires_at');
                localStorage.removeItem('auth_token');
                commit('REMOVE_USER');
                state.isAuthenticated = false
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
    },
    REMOVE_USER (state) {
        state.id = null;
        state.name = null;
        state.email = null;
        state.isAnonymous = true
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
        console.log(date)
        localStorage.setItem('expires_at', JSON.stringify(date));
        localStorage.setItem('auth_token', response.data.auth_token);
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
