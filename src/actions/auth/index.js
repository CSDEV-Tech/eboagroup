import * as actionTypes from "../actionTypes";



export const authSuccessAction = (user = {}, message) => {
    // console.log("auth Success !");
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            loading: false,
            feedback: {
                success: true,
                msg: message
            },
            account: user
        }
    }
};

export const authFailedAction = (msg) => {
    // console.log("auth Fail !");
    return {
        type: actionTypes.AUTH_FAIL,
        payload: {
            loading: false,
            feedback: {
                success: false,
                msg: msg
            }
        }
    }
};

export const authLogoutAction = () => {
    // console.log("auth Logout !");

    return {
        type: actionTypes.AUTH_LOGOUT,
        payload: {
            loading: false,
            account: {
                user_id: null,
                token: null,
                first_name: null,
                last_name: null,
                email: null,
                contact1: null,
                contact2: null,
                shipping_addresses: []
            },
            feedback: {
                success: true,
                msg: "Déconnecté avec succès."
            }
        }
    }
};

export const authRegisterAction = (infos = {}) => {
    return {
        type: actionTypes.AUTH_REGISTER,
        payload: {
            signupInfos: infos
        }
    }
};