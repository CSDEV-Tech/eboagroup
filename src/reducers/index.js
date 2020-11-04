import * as actionTypes from "../actions/actionTypes";

const rootReducer = (state, action) => {
    // console.log("state -> ",state , "action -> ", action);

    switch (action.type) {
        case actionTypes.CHANGE_PATH:
        case actionTypes.AUTH_SUCCESS:
        case actionTypes.START_OPERATION:
        case actionTypes.AUTH_LOGOUT:
        case actionTypes.END_OPERATION:
        case actionTypes.DELETE_FEEDBACK:
        case actionTypes.AUTH_FAIL:
        case actionTypes.SEND_FEEDBACK:
        case actionTypes.AUTH_REGISTER:
        case actionTypes.INIT_APP:
        case actionTypes.SELECT_ITEM:
        case actionTypes.SET_CART:
        case actionTypes.SET_WISHLIST:
        case actionTypes.SET_VALIDATE_CHECKOUT:
        case actionTypes.SET_LAST_CODE:
        case actionTypes.SET_COMMANDS:
        case actionTypes.SET_SEARCH_RESULTS:
        case actionTypes.SET_PRODUCTS:
        case actionTypes.SET_SEARCH_PAGE:
        case actionTypes.BLOG_INDEX:
        case actionTypes.BLOG_DETAIL:
        case actionTypes.BLOG_ADD_COMMENT:
        case actionTypes.BLOG_UPDATE_COMMENT:
        case actionTypes.BLOG_DELETE_COMMENT:
        case actionTypes.BLOG_SET_SEARCH_RESULTS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export default rootReducer;
