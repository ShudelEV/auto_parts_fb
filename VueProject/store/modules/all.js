const state = {
    partBrands: []
};

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z"];

const getters = {
    sortedPartBrands ( state ) {
        let res = {};
        for (let a of alphabet) {
            let obj_a = state.partBrands
                .filter(i => i.name.startsWith(a) || i.name.startsWith(a.toLowerCase()));
            if (obj_a.length) {
                res[a] = obj_a.sort((a, b) => a.fb_quantity > b.fb_quantity ? 1 : -1);
            }
        }
        return res
    },
    getFBByBrand: state => name => {
        return state.partBrands.find((i => i.name == name)).feedbacks
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

    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
