import * as actionTypes from "../actionTypes";

export const setCartAction = (cart) => {
    return {
        type: actionTypes.SET_CART,
        payload: {
            cart
        }
    }
};

