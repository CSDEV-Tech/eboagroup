import "./auth";
import axios from "axios";
import {
  authFailedAction,
  authLogoutAction,
  authRegisterAction,
  authSuccessAction,
} from "./auth";
import {
  changePathAction,
  initAppAction,
  operationEndAction,
  operationStartAction,
  sendFeedBackAction,
} from "./common";
import _ from "lodash";
import { setCartAction } from "./ecommerce/cart";
import { setWishListAction } from "./ecommerce/wishlist";
import {
  setCheckoutValidatedAction,
  setCommandsAction,
  setLastCodeAction,
} from "./ecommerce/commands";
import { setResultsAction } from "./ecommerce/search";

/*************************/
/*    GET THE HOST       */
/*************************/

export const getHost = (app = "ecommerce") => {
  // get host depending on the environnement
  let host = window.location.host;

  if (host === "localhost:3000") {
    host = "http://localhost:8001/api";
  } else if (host === "localhost:8001") {
    host = "/api";
  } else if (host.startsWith("www")) {
    host = host.replace("www", "//api");
  }
  // Inside docker container
  else if (host.startsWith("192.168.99.100")) {
    host = "http://192.168.99.100/api";
  } else {
    host = `//api.${host}`;
  }

  // Add app url to host
  host = `${host}/${app}`;

  return host;
};

export const getPath = (image: string, app: string) => {
  return getHost(app) === `http://localhost:8001/api/${app}`
    ? `http://localhost:8001${image}`
    : image;
};

/*****************/
/*    AUTH       */
/*****************/
export const authLogout = () => {
  return (dispatch) => {
    // start auth
    dispatch(operationStartAction());

    // get host
    let host = getHost();
    // get token
    const token = localStorage.getItem("token");

    axios
      .post(`${host}/logout`, null, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(() => {
        // Remove keys stored in storage
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");

        // then dispatch logout
        dispatch(authLogoutAction());
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const editUser = ({
  first_name,
  last_name,
  email,
  contact1,
  contact2,
  default_address: address,
  default_commune: commune,
  default_town: town,
  image,
}) => {
  return (dispatch) => {
    // start auth
    dispatch(operationStartAction());

    // get host
    let host = getHost();
    // get token
    const token = localStorage.getItem("token");
    let data = {
      first_name,
      last_name,
      email,
      contact1,
      contact2,
      address,
      commune,
      town,
    };

    let formData = new FormData();
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      formData.append(keys[i], data[keys[i]]);
    }

    if (image) {
      formData.append("image", image);
    }

    axios
      .put(`${host}/profile-edit`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const { contact1, contact2, email_verified, avatar } = res.data.account;
        const {
          address: default_address,
          town: default_town,
          municipality: commune,
        } = res.data.account.address;
        const {
          first_name,
          last_name,
          id,
          email,
        } = res.data.account.user_related;

        const user = {
          id: id,
          token: token,
          first_name: first_name,
          last_name: last_name,
          email: email,
          contact1: contact1,
          contact2: contact2,
          default_commune: commune,
          default_town: default_town,
          default_address: default_address,
          avatar: getPath(avatar, "ecommerce"),
          email_verified: email_verified,
        };

        // successfully connected
        dispatch(
          authSuccessAction(user, "Informations mises à jour avec succès")
        );
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const authLogin = (email, password) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    axios
      .post(`${host}/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        const { contact1, contact2, email_verified, avatar } = res.data.account;
        const {
          address: default_address,
          town: default_town,
          municipality: commune,
        } = res.data.account.address;
        const {
          first_name,
          last_name,
          id,
          email,
        } = res.data.account.user_related;

        const user = {
          id: id,
          token: token,
          first_name: first_name,
          last_name: last_name,
          email: email,
          contact1: contact1,
          contact2: contact2,
          default_commune: commune,
          default_town: default_town,
          default_address: default_address,
          avatar: getPath(avatar, "ecommerce"),
          email_verified: email_verified,
        };

        // successfully connected
        dispatch(authSuccessAction(user, "Connection effectuée avec succès"));

        // one Year before logout
        const oneYear = 365 * 24 * 3600;

        // disconnect after one year
        const expDate = new Date(new Date().getTime() + oneYear * 1000);

        // set users key
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expDate);

        // logout after time defined
        dispatch(checkAuthTimeout(oneYear));
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

const authGetUser = (token) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    axios
      .get(`${host}/user`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        const { contact1, contact2, email_verified, avatar } = res.data.account;
        const {
          address: default_address,
          town: default_town,
          municipality: commune,
        } = res.data.account.address;
        const {
          first_name,
          last_name,
          id,
          email,
        } = res.data.account.user_related;

        const user = {
          id: id,
          token: token,
          first_name: first_name,
          last_name: last_name,
          email: email,
          contact1: contact1,
          contact2: contact2,
          default_commune: commune,
          default_town: default_town,
          default_address: default_address,
          avatar: getPath(avatar, "ecommerce"),
          email_verified: email_verified,
        };

        // alert(user.email + " " + user.avatar);

        // successfully connected
        dispatch(
          authSuccessAction(
            user,
            "Connection automatique effectuée avec succès."
          )
        );
      })
      .catch((err) => {
        // // console.error(err.response.data);
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");

    // If not token, then dispatch logout action
    if (!token) {
      dispatch(authLogoutAction());
    } else {
      const expDate = new Date(localStorage.getItem("expirationDate"));
      const today = new Date();

      // Else, if token has expired then logout
      if (expDate <= today) {
        dispatch(authLogout());
      } else {
        // if token has not expired then get user data and start timeout
        dispatch(authGetUser(token));
        dispatch(
          checkAuthTimeout((expDate.getTime() - today.getTime()) / 1000)
        );
      }
    }
  };
};

export const authChangePassword = ({
  oldPassword: old_password,
  newPassword: new_password,
  newPasswordConfirm: new_password_confirmation,
}) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    // get token
    const token = localStorage.getItem("token");
    axios
      .post(
        `${host}/password-change`,
        {
          old_password,
          new_password,
          new_password_confirmation,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const authResetPasswordRequest = (email) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    // // get token
    // const token = localStorage.getItem("token");
    axios
      .post(`${host}/password-reset`, {
        email,
      })
      .then((res) => {
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const authResetPassword = (token, password1, password2) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    // // get token
    // const token = localStorage.getItem("token");
    axios
      .put(`${host}/password-reset`, {
        token,
        password1,
        password2,
      })
      .then((res) => {
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const authSendEmailConfirmRequest = () => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    // // get token
    const token = localStorage.getItem("token");
    axios
      .post(`${host}/send-email-confirm/`, null, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

export const authEmailConfirm = (token) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    // // get token
    // const token = localStorage.getItem("token");
    axios
      .post(`${host}/email-confirm/`, { token })
      .then((res) => {
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End however
        dispatch(operationEndAction());
      });
  };
};

export const authRegister = (register_info = {}) => {
  return (dispatch) => {
    dispatch(operationStartAction());
    dispatch(authRegisterAction(register_info));

    let host = getHost();
    axios
      .post(`${host}/register`, {
        ...register_info,
      })
      .then((res) => {
        dispatch(sendFeedBackAction(true, "Compte créé avec succès."));

        // Finish Register
        dispatch(
          authRegisterAction({
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
            password2: "",
          })
        );
      })
      .catch((err) => {
        dispatch(
          authFailedAction(
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        // End auth however
        dispatch(operationEndAction());
      });
  };
};

const checkAuthTimeout = (expirationDate) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationDate * 1000);
  };
};

/*****************/
/*    COMMON     */
/*****************/
export const changePath = (pathname, params) => {
  return (dispatch) => {
    // dispatch(deleteFlashAction());
    // dispatch(initApp());
    dispatch(setCheckoutValidatedAction(false));
    dispatch(setLastCodeAction(""));
    dispatch(changePathAction(pathname, params));
  };
};

export const initApp = () => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    axios
      .get(`${host}/`)
      .then((res) => {
        // dispatch(sendFeedBackAction(true, "App Init SuccessFul"));

        // // console.clear();

        const {
          slides,
          categories,
          articles,
          promotions,
          tags,
          towns,
          municipalities,
        } = res.data;
        let data = {
          slides: [],
          categories: [],
          promotions: [],
          articles: [],
          tags,
          towns,
          municipalities,
        };

        _.map(slides, (val) => {
          let img = val.image;
          let bg_img = val.bg_image;
          if (host === `http://localhost:8001/api/ecommerce`) {
            img = `http://localhost:8001${val.image}`;
            val.bg_image !== null &&
              (bg_img = `http://localhost:8001${val.bg_image}`);
          }

          data.slides.push({ ...val, image: img, bg_image: bg_img });
        });

        _.map(articles, (val) => {
          let img = val.image1;
          let images = [val.image1, val.image2, val.image3, val.image4];

          if (host === `http://localhost:8001/api/ecommerce`) {
            img = `http://localhost:8001${val.image1}`;
            images = _.map(images, (image) =>
              image ? `http://localhost:8001${image}` : null
            );
          }

          data.articles.push({ ...val, image: img, images });
        });

        _.map(promotions, (val) => {
          let img = val.image;
          if (host === `http://localhost:8001/api/ecommerce`) {
            img = `http://localhost:8001${val.image}`;
          }
          data.promotions.push({ ...val, image: img });
        });

        _.map(categories, (val) => {
          let img = val.image;
          if (host === `http://localhost:8001/api/ecommerce`) {
            val.image != null && (img = `http://localhost:8001${val.image}`);
          }
          data.categories.push({ ...val, image: img });
        });

        dispatch(initAppAction(data));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const contact = (name, phone, email, message) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    axios
      .post(`${host}/contact`, {
        name,
        phone,
        email,
        message,
      })
      .then((res) => {
        // End operation
        dispatch(operationEndAction());

        // Send Visual FeedBack to users
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

/*****************/
/*    CART       */
/*****************/
export const createCart = () => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    axios
      .post(`${host}/cart/`)
      .then((res) => {
        // // console.clear();

        const { cart } = res.data;

        localStorage.setItem("cart_ref", cart.ref);

        dispatch(setCartAction(cart));
        dispatch(sendFeedBackAction(true, "Panier créé avec succès"));

        // const {slides, categories, articles, promotions} = res.data;
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const getCart = (ref) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    axios
      .get(`${host}/cart/${ref}/`)
      .then((res) => {
        // dispatch(sendFeedBackAction(true, "App Init SuccessFul"));

        // console.clear();

        const { cart } = res.data;

        // set data
        dispatch(setCartAction(cart));
        dispatch(sendFeedBackAction(true, "Panier récupéré avec succès"));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );

        // if error then create cart
        dispatch(createCart());
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const checkCart = () => {
  return (dispatch) => {
    // Get or create Cart
    const ref = localStorage.getItem("cart_ref");

    if (ref) {
      dispatch(getCart(ref));
    } else {
      dispatch(createCart());
    }
  };
};

export const addItemToCart = (item, count, type = "article") => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    const ref = localStorage.getItem("cart_ref");

    const nameType = type === "article" ? "article_id" : "promo_id";

    axios
      .put(`${host}/cart/${ref}`, {
        type: type,
        [nameType]: item.id,
        count: count,
        action: "update",
      })
      .then((res) => {
        // console.clear();

        const { cart } = res.data;

        dispatch(setCartAction(cart));
        dispatch(
          sendFeedBackAction(true, "Element ajouté au panier avec succès !")
        );
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const removeItemFromCart = (item, type = "article") => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    const ref = localStorage.getItem("cart_ref");

    const nameType = type === "article" ? "article_id" : "promo_id";

    axios
      .put(`${host}/cart/${ref}`, {
        type: type,
        [nameType]: item.id,
        action: "delete",
      })
      .then((res) => {
        // console.clear();

        const { cart } = res.data;

        dispatch(setCartAction(cart));
        dispatch(
          sendFeedBackAction(true, "Element retiré du panier avec succès !")
        );
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const addItemToWishList = (item) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    const token = localStorage.getItem("token");

    axios
      .put(
        `${host}/wishlist/`,
        {
          article_id: item.id,
          action: "update",
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        // console.clear();

        const { wishlist } = res.data;

        dispatch(setWishListAction(wishlist));
        dispatch(
          sendFeedBackAction(
            true,
            "Element ajouté à la liste de souhaits avec succès !"
          )
        );
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const getWishList = () => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();

    const token = localStorage.getItem("token");

    axios
      .get(`${host}/wishlist/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        // console.clear();

        const { wishlist } = res.data;

        dispatch(setWishListAction(wishlist));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

/*****************/
/*    WISHLIST   */
/*****************/
export const removeItemFromWishList = (item) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();
    const token = localStorage.getItem("token");

    axios
      .put(
        `${host}/wishlist/`,
        {
          article_id: item.id,
          action: "delete",
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        // console.clear();

        // console.clear();

        const { wishlist } = res.data;

        dispatch(setWishListAction(wishlist));
        dispatch(
          sendFeedBackAction(
            true,
            "Element retiré de la liste de souhaits avec succès !"
          )
        );
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

/*****************/
/*    COMMANDS   */
/*****************/
export const checkout = ({
  first_name,
  last_name,
  contact,
  town,
  address,
  payment_type,
  commune,
  details,
}) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();

    const token = localStorage.getItem("token");
    const cart_ref = localStorage.getItem("cart_ref");

    axios
      .post(
        `${host}/checkout`,
        {
          first_name,
          last_name,
          contact,
          town,
          address,
          payment_type,
          cart_ref,
          commune,
          details,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        // dispatch(sendFeedBackAction(true, "App Init SuccessFul"));

        // // console.clear();

        const code = res.data.command.shipping_code;

        dispatch(sendFeedBackAction(true, "Commande validée avec succès."));
        dispatch(setLastCodeAction(code));
        dispatch(setCheckoutValidatedAction(true));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

export const getCommands = () => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();

    const token = localStorage.getItem("token");

    axios
      .get(`${host}/commands`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        const items = res.data;
        dispatch(setCommandsAction({ items }));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

/*****************/
/*    SEARCH     */
/*****************/
export const search = (params, oldResults = []) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();

    // query
    const query = params.q ? params.q : "";

    const page = params.p ? params.p : 1;
    // category
    const category = params.c ? params.c : "";

    let tags = params["tags[]"] ? params["tags[]"] : [];
    let filters = params["filters[]"] ? params["filters[]"] : [];

    if (!_.isArray(tags)) {
      tags = [tags];
    }

    if (!_.isArray(filters)) {
      filters = [filters];
    }

    const data = {
      query,
      filters: _.join(filters, ";"),
      tags: _.join(tags, ";"),
      category,
      page,
    };

    axios
      .post(`${host}/search`, data)
      .then((res) => {
        let { results, total_pages, page, total_results } = res.data;

        if (page > 1) {
          results = [...results, ...oldResults];
        }
        dispatch(setResultsAction(results, total_results, page, total_pages));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};

/*****************/
/*    PRODUCTS   */
/*****************/
export const rateProduct = (product, note) => {
  return (dispatch) => {
    dispatch(operationStartAction());

    let host = getHost();

    const token = localStorage.getItem("token");

    axios
      .post(
        `${host}/note-article/`,
        {
          article_id: product.id,
          note: note,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        // const { product } = res.data;
        dispatch(sendFeedBackAction(true, res.data.msg));
      })
      .catch((err) => {
        dispatch(
          sendFeedBackAction(
            false,
            err.response.data.msg ? err.response.data.msg : err.toString()
          )
        );
      })
      .finally(() => {
        dispatch(operationEndAction());
      });
  };
};
