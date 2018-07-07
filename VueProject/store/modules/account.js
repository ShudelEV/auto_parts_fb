import axios from 'axios'

const state = {
    id: null,
    name: '',
    email: '',
    loggedIn: false,
    isAnonymous : true,
    error: {},
    token: null
};

const getters = {
};

const actions = {
    registerWithEmailAndPassword ({ dispatch, commit }, form) {
        axios.post(
            '/auth/users/create/',
            { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                commit('SET_USER', response.data);
                // log in
                dispatch('getToken', form)
            }
        ).catch(
            error => {
                if (error.response) {
                    console.log(error.response.data);
                    commit('SET_ERROR', error.response.data)
                } else {
                    console.log('Error ', error.message)
                }
            }
        )
    },
    // log in
    getToken ({ commit, state }, form) {
        axios.post(
                '/auth/token/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                // console.log(response.data.auth_token);
                state.token = response.data.auth_token;
                state.loggedIn = true;
                state.isAnonymous = false
            }
        ).catch(
            error => {
                if (error.response) {
                    console.log(error.response.data);
                    commit('SET_ERROR', error.response.data)
                } else {
                    console.log('Error ', error.message)
                }
            }
        )
    },
    // log out
    destroyToken ({ state }) {
        axios.post(
            '/auth/token/destroy/',
            { },
            {
                headers: { Authorization: 'Token ' + state.token }
            }
        ).then(
            response => {
                state.token = null;
                state.loggedIn = false;
                state.isAnonymous = true
            }
        ).catch(
            error => {
                console.log('destroyToken', error);
            }
        )

    }
};

const mutations = {
    SET_USER (state, user) {
        state.id = user.id;
        state.name = user.username;
        state.email = user.email;
    },
    SET_ERROR (state, error) {
        state.error = error;
        state.loggedIn = false
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
