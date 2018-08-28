import Vue from 'vue'

const state = {
    showLoginWindow: false,
    // before send fb and user is not authenticated, suggest login
    showSuggestLogin: false,
    id: null,
    name: null,
    email: null,
    isAuthenticated: false,
    isAnonymous: true,
    message: [],
    cars: []
};

const getters = {
    carList ( state ) {
        let res = [];
        if (state.cars) {
            state.cars.forEach((car, index) => {
                let model = car.model;
                model += car.manufacture_year ? ' ' + car.manufacture_year + ' m.y.' : '';
                model += car.engine_volume ? ' ' + car.engine_volume + ' cm3' : '';
                res.push({ id: car.id, model})
            })
        }
        return res
    }
};

const actions = {
    // sig up with email (login) and password
    registerWithEmailAndPassword ({ dispatch, commit }, { form }) {
        Vue.axios.post(
                '/auth/users/create/',
                { 'username': form.username, 'password': form.password }
            ).then(
            response => {
                    if (response.status === 201) { dispatch('getToken', { form }); }
                }
            ).catch(
                error => { commit('HANDLE_ERROR', error); }
            )
    },
    // log in
    getToken ({ state, commit, dispatch }, { form }) {
        Vue.axios.post(
                '/auth/jwt/create/',
                { 'username': form.username, 'password': form.password }
            ).then(
                response => {
                    if (response.status === 200) {
                        // remove session if register an anonymous user
                        commit('REMOVE_USER');
                        commit('SET_SESSION', response);
                        // get a user information
                        dispatch('getUser', { anonymous: false });
                        // close the login window
                        state.showLoginWindow = false;
                        state.showSuggestLogin = false;
                    }
                }
            ).catch(
                error => {
                    commit('HANDLE_ERROR', error)
                }
            )
    },
    // get user information
    getUser ({ commit, dispatch }, { anonymous }) {
        Vue.axios.get('/auth/me/').then(
            response => {
                commit('SET_USER', { data: response.data, anonymous });
                // get user cars for the addFB page
                dispatch('getUserCars')
            }
        ).catch(
            error => {
                // Unauthorized user
                if (error.response.status === 401) {
                    commit('REMOVE_USER');
                } else {
                    commit('HANDLE_ERROR', error)
                }
            }
        );
    },
    getUserCars ({ commit, state }) {
        Vue.axios.get('/api/cars/' + state.name + '/').then(
            response => { state.cars = response.data; }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        );
    },
    // refresh JWT Token
    refreshToken ({ commit }, { token, callback }) {
        Vue.axios.post('/auth/jwt/refresh/', { token })
            .then(
                response => {
                    if (response.status === 200) {
                        commit('SET_SESSION', response);
                        callback()
                    }
                }
            ).catch(
                error => { commit('HANDLE_ERROR', error); }
            )
    },

    // Social registration:

    registerWithSocial ({ commit }, provider) {
        Vue.axios.get('/auth/o/' + provider + '/?redirect_uri=/logged-in/' + provider)
            .then(
                response => {
                    if (response.status === 200) {
                        // catch response from a provider on /logged-in/ page (LoggedInCallback component)
                        window.location.href = response.data.authorization_url;
                    }
                }
            ).catch(
                error => { commit('HANDLE_ERROR', error); }
            )
    },
    getTokenSocialAuth ({ commit, dispatch }, { query, provider }) {
        let url = '/auth/o/' + provider + '/?';
        // dispatch all query props to the server
        for (let q in query) {
            url += q + '=' + query[q] + '&'
        }
        url.slice(-1);
        Vue.axios.post(url)
            .then(
                response => {
                    if (response.status === 201) {
                        // remove session if register an anonymous user
                        commit('REMOVE_USER');
                        commit('SET_SESSION', response);
                        // get a user information
                        dispatch('getUser', { anonymous: false });
                    }
                }
            ).catch(
                error => {
                    commit('HANDLE_ERROR', error)
                }
            )
    },

    // Create anonymous user

    registerAnonymousUser ({ dispatch, commit }, callBack) {
        Vue.axios.get('/auth/users/create-anonymous/')
            .then(
                response => {
                    dispatch('getTokenAnonymousUser', { form: response.data, callBack: callBack });
                })
            .catch(
                error => { commit('HANDLE_ERROR', error); }
            )
    },
    getTokenAnonymousUser ({ commit, dispatch }, { form, callBack }) {
        Vue.axios.post(
                '/auth/jwt/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                localStorage.setItem('anonymous_user_name', form.username);
                localStorage.setItem('anonymous_user_password', form.password);
                commit('SET_SESSION', response);
                // get a user information
                dispatch('getUser', { anonymous: true });
                // send FB
                callBack()
            }
        ).catch(
            error => { commit('HANDLE_ERROR', error); }
        )
    }
};

const mutations = {
    SET_USER (state, user) {
        state.id = user.data.id;
        state.name = user.data.username;
        state.email = user.data.email;
        state.isAnonymous = user.anonymous;
        state.isAuthenticated = true;
    },
    REMOVE_USER (state) {
        state.id = null;
        state.name = null;
        state.email = null;
        state.cars = [];
        state.isAnonymous = true;
        state.isAuthenticated = false;
        localStorage.removeItem('expires_at');
        localStorage.removeItem('token');
        localStorage.removeItem('anonymous_user_name');
        localStorage.removeItem('anonymous_user_password');
        delete Vue.axios.defaults.headers.common['Authorization'];
    },
    SET_SESSION (state, response) {
        // set axios default config
        Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
        localStorage.setItem('token', response.data.token);
        // set expiration
        let date = new Date(response.headers.date);
        date.setDate(date.getDate() + 7);
        localStorage.setItem('expires_at', JSON.stringify(date));
    },
    HANDLE_ERROR (state, error) {
        if (error.response) {
            // console.log(error.response.data)
            let err_data = error.response.data;
            if (err_data.detail) {
                state.message.push({message: err_data.detail, status: 'danger' })
            } else {
                for (let i in err_data) {
                    for (let m of err_data[i]) {
                        const message = i == 'non_field_errors' ? m : (i + ': ' + m);
                        state.message.push({message: message, status: 'danger' })
                    }
                }
            }
        }
    },
    SET_ERROR (state, message) {
        state.message.push({ message, status: 'danger' })
    },
    SET_WARNING (state, message) {
        state.message.push({ message, status: 'warning' })
    },
    SET_SUCCESS (state, message) {
        state.message.push({ message, status: 'success' })
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
