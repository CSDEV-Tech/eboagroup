import * as actionTypes from "../actionTypes";

export const setProductAction = (products) => {
    return {
        type: actionTypes.SET_PRODUCTS,
        payload: {
            products
        }
    }
};

