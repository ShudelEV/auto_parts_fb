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
            response => { dispatch('getToken', { form: form }) }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        )
    },
    registerWithSocial ({ commit }, provider) {
        Vue.axios.get('/auth/o/' + provider + '/?redirect_uri=/logged-in/' + provider).then(
            response => {
                window.location.href = response.data.authorization_url;
            }
        ).catch(
            error => { commit('HANDLE_ERROR', error) }
        )
    },
    // log in
    getToken ({ state, commit, dispatch }, { form }) {
        Vue.axios.post(
                '/auth/token/create/',
                { 'username': form.username, 'password': form.password }
        ).then(
            response => {
                // remove session if register an anonymous user
                commit('REMOVE_USER');
                commit('SET_SESSION', response);
                // set axios default config
                Vue.axios.defaults.headers.common['Authorization'] = 'Token ' + response.data.auth_token;
                // get a user information
                dispatch('getUser', { anonymous: false });
                // close the login window
                state.showLoginWindow = false;
                state.showSuggestLogin = false;
            }
        ).catch(
            error => {
                commit('HANDLE_ERROR', error)
            }
        )
    },
    getTokenSocialAuth ({ state, commit, dispatch }, { query, provider }) {
        let url = '/auth/o/' + provider + '/?';
        // dispatch all query props to the server
        for (let q in query) {
            url += q + '=' + query[q] + '&'
        }
        Vue.axios.post(url).then(
            response => {
                if (response.status == '201') {
                    // remove session if register an anonymous user
                    commit('REMOVE_USER');
                    commit('SET_SESSION', response);
                    // set axios default config
                    Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
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
                // get a user information
                dispatch('getUser', { anonymous: true });
                // send FB
                callBack()
            }
        ).catch(
            error => {
                commit('REMOVE_USER');
                commit('HANDLE_ERROR', error)
            }
        )
    },
    // refresh JWT Token
    refreshJWTToken ({ commit }, { jwt_token, callback }) {
        const data = { 'token': jwt_token };
        Vue.axios.post('/auth/jwt/refresh/', data).then(
            response => {
                localStorage.setItem('jwt_token', response.data.token);
                Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
                let date = new Date(response.headers.date);
                date.setDate(date.getDate() + 1);
                localStorage.setItem('expires_at', JSON.stringify(date));
                callback()
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
                sessionStorage.setItem('notSuggestLogin', false);
            }
        ).catch(
            error => commit('HANDLE_ERROR', error)
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token_expires_at');
        localStorage.removeItem('anonymous_user_auth_token');
        localStorage.removeItem('anonymous_user_name');
        localStorage.removeItem('anonymous_user_password');
        delete Vue.axios.defaults.headers.common['Authorization'];
    },
    SET_SESSION (state, response) {
        const auth_token = response.data.auth_token;
        const jwt_token = response.data.token;
        let date = new Date(response.headers.date);
        if (auth_token) {
            localStorage.setItem('auth_token', auth_token);
            date.setDate(date.getDate() + 7);
            localStorage.setItem('expires_at', JSON.stringify(date));
        } else if (jwt_token) {
            localStorage.setItem('jwt_token', jwt_token);
            date.setDate(date.getDate() + 1);
            localStorage.setItem('expires_at', JSON.stringify(date));
            date.setDate(date.getDate() + 6);
            localStorage.setItem('refresh_token_expires_at', JSON.stringify(date));
        }
    },
    SET_SESSION_ANONYMOUS_USER (state, response) {
        let date = new Date(response.headers.date);
        // add 90 days
        date.setDate(date.getDate() + 90);
        localStorage.setItem('expires_at', JSON.stringify(date));
        localStorage.setItem('anonymous_user_auth_token', response.data.auth_token);
        state.isAnonymous = true;
        state.isAuthenticated = true;
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
