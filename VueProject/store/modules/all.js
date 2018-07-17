const state = {
    partBrands: [],
    partTypes: [],
    partCategories: null
};

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z"];

const getters = {
    // part brands are sorted and divided by alphabet
    sortedPartBrands ( state ) {
        let res = {};
        for (let a of alphabet) {
            let obj_a = state.partBrands
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
    }
};

const actions = {
};

const mutations = {
    SET_PART_BRANDS (state, objects) {
        state.partBrands = objects
    },
    ADD_PART_BRANDS (state, object) {  },
    SET_BRAND_FEEDBACKS (state, { name, items }) {
        let brandIndex = state.partBrands.findIndex(i => i.name == name);
        if (brandIndex >= 0) {
            state.partBrands[brandIndex].feedbacks = items
        } else {
            console.log('store/SET_BRAND_FEEDBACKS: A brand item ' + name + ' is not find')
        }
    },
    SET_PART_TYPES (state, { category_list, part_types }) {
        state.partTypes = part_types;
        state.partCategories = category_list
    },
};

export default {
    state,
    getters,
    actions,
    mutations
}
