const state = {
    // partBrands: [{ id: Integr, name: String, feedbacks: { [pageNumber]: [feedbacks] }, ... }, ...]
    partBrands: [],
    partTypes: [],
    partCategories: null,
    carBrands: null,
    carModels: null,
    message: []
};

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z"];

const getters = {
    // part brands are sorted and divided by alphabet
    sortedPartBrands: state => pattern => {
        let res = {};
        const PATTERN = new RegExp(pattern, 'i');
        for (let a of alphabet) {
            let obj_a = state.partBrands
                .filter(i => PATTERN.test(i.name))
                .filter(i => i.name.startsWith(a) || i.name.startsWith(a.toLowerCase()));
            if (obj_a.length) {
                res[a] = obj_a.sort((a, b) => a.fb_quantity > b.fb_quantity ? -1 : 1);
            }
        }
        return res
    },
    getFBByBrand: state => name => {
        return state.partBrands.find((i => i.name == name)).feedbacks
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
        return state.carModels ? state.carModels.filter((i => i.brand == brand)) : []
    },
    getFB: state => req => {
        let res = [];
        let brandIndex = state.partBrands.findIndex(i => i.name == req.brandName);
        if (brandIndex >=  0) {
            if (state.partBrands[brandIndex].feedbacks) {
                res = state.partBrands[brandIndex].feedbacks[req.pageNumber]
            }
        }
        return res
    }
};

const actions = {
};

const mutations = {
    SET_PART_BRANDS (state, objects) {
        state.partBrands = objects
    },
    ADD_PART_BRANDS (state, object) {  },
    SET_BRAND_FEEDBACKS (state, { brandName, items, page_number }) {
        let brandIndex = state.partBrands.findIndex(i => i.name == brandName);
        if (brandIndex < 0) {
            brandIndex = state.partBrands.push({ name: brandName }) - 1; // Array.prototype.push() returns an array length
            // console.log('store/SET_BRAND_FEEDBACKS: A brand item ' + brandName + ' is not find')
        }
        if (state.partBrands[brandIndex].feedbacks) {
            state.partBrands[brandIndex].feedbacks[page_number] = items
        } else {
            state.partBrands[brandIndex].feedbacks = { [page_number]: items }
        }
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
        state.message.push({ message: message, status: status })
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
