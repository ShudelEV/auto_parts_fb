import { ALPHABET } from '../../data'
import Vue from 'vue'

const state = {
    // partBrands: [{ id: Integr, name: String, feedbacks: { [pageNumber]: [feedbacks] }, ... }, ...]
    partBrands: [],
    partTypes: [],
    partCategories: null,
    carBrands: null,
    carModels: null,
    newFBId: null,
    feedbacks: {},
    page: 1,
    pageQty: 1,
    loading: false,
    prevRequest: null,
    message: []
};

const getters = {
    // part brands are sorted and divided by alphabet
    sortedPartBrands: state => pattern => {
        let res = {};
        const PATTERN = new RegExp(pattern, 'i');
        for (let a of ALPHABET) {
            let obj_a = state.partBrands
                .filter(i => PATTERN.test(i.name))
                .filter(i => i.name.startsWith(a) || i.name.startsWith(a.toLowerCase()));
            if (obj_a.length) {
                res[a] = obj_a.sort((a, b) => a.fb_quantity > b.fb_quantity ? -1 : 1);
            }
        }
        return res
    },
    getPartBrand: state => name => {
        return state.partBrands.find((i => i.name === name))
    },
    // part types are divided by categories
    getPartTypes ( state ) {
        let res = {};
        for (let category in state.partCategories) {
            let item = state.partTypes
                .filter(i => i.category === category);
            if (item.length) {
                res[state.partCategories[category]] = item.sort((a, b) => a.name > b.name ? 1 : -1);
            }
        }
        return res
    },
    getCarModels: state => brand => {
        return state.carModels ? state.carModels.filter(i => i.brand === brand) : []
    },
    feedbacks: state => page => {
        const fbs = state.feedbacks[page];
        if (!fbs) { return {} }
        let res = {};
        for (let brand of state.partBrands) {
            let items = fbs.filter(i => i.part.brand === brand.id);
            if (items.length) { res[brand.name] = items }
        }
        return res
    }
};

const actions = {
    getFB ({ state, commit }, { filter, page, brandName }) {
        let pageNumber = page;
        let url = '/api/feedbacks/';
        if (brandName) { url += brandName + '/'; }
        if (pageNumber) {
            url += '?page=' + pageNumber
        } else {
            pageNumber = 1;
        }
        const method = Object.keys(filter).length ? 'post' : 'get';
        const conf = method === 'get' ? { url } : { url, method, data: filter };
        state.loading = true;
        Vue.axios.request(conf)
            .then(response => {
                // update fbs when query is changed, but save the transition effect
                if (!(JSON.stringify(state.prevRequest) === JSON.stringify(filter))) { commit('DELETE_FB') }
                state.loading = false;
                state.prevRequest = filter;
                commit('SET_FEEDBACKS', {
                    page: pageNumber,
                    items: response.data.results
                });
                state.page = pageNumber;
                let pageQty = response.data.count / 20;
                let roundPageQty = Math.trunc(pageQty);
                state.pageQty = pageQty === roundPageQty ? roundPageQty : roundPageQty + 1
            })
            .catch(error => {
                state.loading = false;
                const message = error.response ? error.response.data : error.data;
                commit('SET_MESSAGE', { message, status: 'warning' });
            })
    }
};

const mutations = {
    SET_PART_BRANDS (state, objects) {
        state.partBrands = objects
    },
    ADD_PART_BRANDS (state, object) {  },
    SET_FEEDBACKS (state, { page, items }) {
        state.feedbacks[page] = items;
    },
    SET_PART_TYPES (state, { category_list, part_types }) {
        state.partTypes = part_types;
        state.partCategories = category_list
    },
    SET_CAR_MODELS (state, { brand_list, car_models }) {
        state.carBrands = brand_list;
        state.carModels = car_models;
    },
    SET_MESSAGE (state, { message, status }) {
        state.message.push({ message, status })
    },
    DELETE_FB (state) {
        state.feedbacks = {};
        state.pageQty = 1;
        state.page = 1
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
