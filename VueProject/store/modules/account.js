import Vue from 'vue'


const JWT_EXPIRATION_DELTA = 12;  // in hours
const JWT_REFRESH_EXPIRATION_DELTA = 168;  // in hours
const JWT_REFRESH_BEFORE_EXPIRATION_DELTA = 1;  // in hours

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
                        commit('REMOVE_SESSION');
                        commit('SET_SESSION', response);
                        // get a user information
                        dispatch('getUser');
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
    getUser ({ commit, dispatch }) {
        dispatch('verifySession', (ver) => {
            if (ver) {
                Vue.axios.get('/auth/me/').then(
                    response => {
                        commit('SET_USER', { data: response.data });
                        // get user cars for the addFB page
                        dispatch('getUserCars')
                    }
                ).catch(
                    error => {
                        // Unauthorized user
                        if (error.response.status === 401) {
                            commit('REMOVE_SESSION');
                        } else {
                            commit('HANDLE_ERROR', error)
                        }
                    }
                );
            }
        })
    },
    getUserCars ({ commit, state }) {
        Vue.axios.get('/api/cars/' + state.name + '/').then(
            response => { state.cars = response.data; }
        ).catch(
            error => commit('HANDLE_ERROR', error)
        );
    },
    // verify the session
    verifySession ({ commit, dispatch }, callback) {
        const now = new Date(Date.now());
        const expiresAt = new Date(JSON.parse(localStorage.getItem('expires_at')));
        const refreshTokenExpiresAt = new Date(JSON.parse(localStorage.getItem('refresh_token_expires_at')));
        const token = localStorage.getItem('token');
        const anonUserName = localStorage.getItem('anonymous_user_name');
        const anonUserPass = localStorage.getItem('anonymous_user_password');
        if (expiresAt && token && refreshTokenExpiresAt) {
            // Session is expired
            if (expiresAt < now || refreshTokenExpiresAt < now) {
                if (anonUserName && anonUserPass) {
                    // Open anonymous session
                    dispatch('getTokenAnonymousUser', {
                        form: { 'username': anonUserName, 'password': anonUserPass },
                        callback: () => { callback(true) }
                    })
                } else {
                    // Close session
                    commit('REMOVE_SESSION');
                    callback(false);
                }
            // Token is expired in JWT_REFRESH_BEFORE_EXPIRATION_DELTA
            } else if (now < expiresAt && now > expiresAt.setHours(expiresAt.getHours() - JWT_REFRESH_BEFORE_EXPIRATION_DELTA)) {
                // Refresh token
                dispatch('refreshToken', { token, callback });
            // Session is not expired
            } else {
                Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
                callback(true);
            }
        } else {
            // commit('REMOVE_SESSION');
            callback(false);
        }
    },
    // refresh Token
    refreshToken ({ commit }, { token, callback }) {
        Vue.axios.post('/auth/jwt/refresh/', { token })
            .then(
                response => {
                    if (response.status === 200) {
                        Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
                        localStorage.setItem('token', response.data.token);
                        let date = new Date(response.headers.date);
                        date.setHours(date.getHours() + JWT_EXPIRATION_DELTA);
                        localStorage.setItem('expires_at', JSON.stringify(date));
                        callback(true)
                    }
                }
            ).catch(
                error => {
                    commit('REMOVE_SESSION');
                    commit('HANDLE_ERROR', error);
                    callback(false);
                }
            )
    },

    // Social registration:

    registerWithSocial ({ commit }, provider) {
        Vue.axios.get('/auth/o/' + provider + '/?redirect_uri=/logged-in/' + provider)
            .then(response => {
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
                        commit('REMOVE_SESSION');
                        commit('SET_SESSION', response);
                        // get a user information
                        dispatch('getUser');
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
                dispatch('getUser');
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
        state.isAnonymous = localStorage.getItem('anonymous_user_name') && localStorage.getItem('anonymous_user_password');
        state.isAuthenticated = true;
    },
    SET_SESSION (state, response) {
        // set axios default config
        Vue.axios.defaults.headers.common['Authorization'] = 'JWT ' + response.data.token;
        localStorage.setItem('token', response.data.token);
        // set expiration
        let date = new Date(response.headers.date);
        date.setHours(date.getHours() + JWT_EXPIRATION_DELTA);
        localStorage.setItem('expires_at', JSON.stringify(date));
        date.setHours(date.getHours() + (JWT_REFRESH_EXPIRATION_DELTA - JWT_EXPIRATION_DELTA));
        localStorage.setItem('refresh_token_expires_at', JSON.stringify(date));
    },
    REMOVE_SESSION (state) {
        state.id = null;
        state.name = null;
        state.email = null;
        state.cars = [];
        state.isAnonymous = true;
        state.isAuthenticated = false;
        localStorage.removeItem('expires_at');
        localStorage.removeItem('refresh_token_expires_at');
        localStorage.removeItem('token');
        localStorage.removeItem('anonymous_user_name');
        localStorage.removeItem('anonymous_user_password');
        delete Vue.axios.defaults.headers.common['Authorization'];
    },
    HANDLE_ERROR (state, error) {
        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
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
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
            console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
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
