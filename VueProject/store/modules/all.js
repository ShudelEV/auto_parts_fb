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
    loading: false,
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
    feedbacks: state => req => {
        // let brandIndex = state.partBrands.findIndex(i => i.name === brandName);
        // if (brandIndex >=  0) {
        //     if (state.partBrands[brandIndex].feedbacks) {
        //         res = state.partBrands[brandIndex].feedbacks[req.pageNumber]
        //     }
        // }
        if (req.brandName) {
            return state.feedbacks[req.pageNumber].filter(i => i.brand.name === req.brandName)
        }
    }
};

const actions = {
    getFB ({ state, commit }, { brandName, filter, pageNumber }) {
        let url = '/api/feedbacks/';
        let method = 'get';
        if (brandName) { url += this.brandName + '/'; }
        if (pageNumber != 1) { url += '?page=' + pageNumber }
        if (filter.partCategory || filter.partType) { method = 'post' }
        const conf = method === 'get' ? { url } : { url, method, data: filter };
        state.loading = true;
        Vue.axios.request(conf)
            .then(response => {
                console.log(response);
                commit('SET_FEEDBACKS', {
                    items: response.data.results,
                    pageNumber
                });
                state.loading = false;
//                   let pageQty = response.data.count / this.page_size;
//                   let roundPageQty = Math.trunc(pageQty);
//                   this.total = pageQty == roundPageQty ? roundPageQty : roundPageQty + 1;
//                   this.feedbacks = response.data.results;
//                   this.loading = false;
//                   this.highlightFB()
            })
            .catch(error => {
                this.loading = false;
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
    SET_FEEDBACKS (state, { items, pageNumber }) {
        state.feedbacks[pageNumber] = items;
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
    // delete all feedbacks
    DELETE_FB (state) {
        for (let i = 0; i < state.partBrands.length; i++) {
            if (state.partBrands[i].feedbacks) {
                delete state.partBrands[i].feedbacks
            }
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
