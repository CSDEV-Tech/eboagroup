import * as actionTypes from "../actionTypes";


export const setCommandsAction = (commands) => {
    return {
        type: actionTypes.SET_COMMANDS,
        payload: {
            commands
        }
    }
};

export const setCheckoutValidatedAction = (v) => {
    return {
        type: actionTypes.SET_VALIDATE_CHECKOUT,
        payload: {
            validated: v
        }
    }
};

export const setLastCodeAction = (code) => {
    return {
        type: actionTypes.SET_LAST_CODE,
        payload: {
            last_code: code
        }
    }
};