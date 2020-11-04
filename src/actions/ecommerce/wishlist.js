import * as actionTypes from "../actionTypes";

export const setWishListAction = (wishlist) => {
    return {
        type: actionTypes.SET_WISHLIST,
        payload: {
            wishlist
        }
    }
};

