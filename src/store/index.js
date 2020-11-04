import reducer from "../reducers";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import algoliasearch from "algoliasearch";
// import {generateCategories, generateProducts, generateSlides} from "../utils/functions";

const initialState = {
    // signup Infos
    signupInfos: {
        first_name: "",
        last_name: "",
        email: "",
        contact1: "",
        contact2: "",
        country: "",
        town: "",
        address: "",
        commune: "",
        password1: "",
        password2: ""
    },

    // towns & communes
    towns: [],
    communes: [],

    // currentPath
    currentPath: {
        pathname: "/",
        params: {}
    },

    last_code: "",

    validated: false,

    // Loading
    loading: false,

    // Slides & categories
    categories: [],
    slides: [],
    promotions: [],
    tags: [],

    // Blog
    blog_categories: [],
    blog_posts: {},
    blog_featured: [],
    blog_popular: [],
    blog_shop: [],
    blog_tags: [],

    // account info
    account: {
        user_id: null,
        token: null,
        first_name: null,
        last_name: null,
        email: null,
        contact1: null,
        contact2: null,
        default_town: null,
        default_commune: null,
        default_address: null,
        email_verified: false,
        avatar: null
    },

    // commands
    commands: {
        items: []
    },

    // wish list
    wishlist: {
        items: []
    },

    // Error Message
    feedback: {
        success: null,
        msg: ""
    },

    // Cart
    cart: {
        ref: null,
        cartline_set: [],
        promotions: []
    },

    // Selected Product
    selectedProduct: null,
    currentSelectedImageIndex: 0,

    // All products to see
    latestAndPromotionalProducts: [],

    // products returned from search
    searchResults: {
        items: [],
        num_pages: 0,
        current_page: 1,
        totalCount: 0
    },

    // Articles returned from search
    blogSearchResults: {
        items: [],
        num_pages: 0,
        current_page: 1,
        totalCount: 0
    },

    // search client
    searchClient: algoliasearch("J0PXY3IPX9", "d49d212f5cfc935a08399ba673bb1dfc"),

    searchIndex: "article_index"
};

// STORE
export const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
);
