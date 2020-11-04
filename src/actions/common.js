import * as actionTypes from "./actionTypes";

export const deleteFlashAction = () => {
    return {
        type: actionTypes.DELETE_FEEDBACK,
        payload: {
            feedback: {
                success: null,
                msg: "",
            }
        }
    }
};

// THIS IS AN ACTION creator, it returns an action formatted with data
export const changePathAction = (pathname, params) => {
    return {
        type: actionTypes.CHANGE_PATH,
        payload: {
            currentPath: {
                pathname: pathname,
                params: params
            }
        }
    }
};

export const sendFeedBackAction = (success, message) => {
    return {
        type: actionTypes.SEND_FEEDBACK,
        payload: {
            feedback: {
                success: success,
                msg: message
            }
        }
    }
};

export const operationStartAction = () => {
    // console.log("auth Start !");
    return {
        type: actionTypes.START_OPERATION,
        payload: {
            loading: true
        }
    }
};

export const operationEndAction = () => {
    // console.log("auth End !");
    return {
        type: actionTypes.END_OPERATION,
        payload: {
            loading: false,
        }
    }
};

export const initAppAction = ({slides, articles, promotions, categories, tags, towns, municipalities}) => {
    return {
        type: actionTypes.INIT_APP,
        payload: {
            slides,
            promotions,
            categories,
            tags,
            towns,
            communes: municipalities,
            latestAndPromotionalProducts: articles,
        }
    }
};

export const selectItemAction = (item) => {
    return {
        type: actionTypes.SELECT_ITEM,
        payload : {
            selectedProduct: item
        }
    }
};
