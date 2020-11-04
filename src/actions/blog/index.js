import {getHost} from "..";
import {operationEndAction, operationStartAction, sendFeedBackAction} from "../common";
import axios from "axios";
import _ from "lodash";
import {
    BlogAddCommentAction,
    BlogDetailAction,
    BlogIndexAction,
    BlogDeleteCommentAction,
    BlogUpdateCommentAction, blogResultsAction
} from "./actions";
import {getPath} from "../index";


/******************/
/*   BLOG INDEX   */
/******************/


export const blogIndex = () => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost('blog');

        axios
            .get(`${host}/`)
            .then(res => {

                let {categories, featured, popular, shop, tags} = res.data;

                categories = _.map(categories, val => {
                    val.image !== null && (val.image = getPath(val.image, 'blog'));
                    val.featured_image !== null && (val.featured_image = getPath(val.featured_image, 'blog'));
                    return val;
                });

                featured = _.map(featured, val => {
                    val.image !== null && (val.image = getPath(val.image, 'blog'));
                    return val;
                });

                popular = _.map(popular, val => {
                    val.image !== null && (val.image = getPath(val.image, 'blog'));
                    return val;
                });

                shop = _.map(shop, val => {
                    val.image1 !== null && (val.image1_url = getPath(val.image1, 'blog'));
                    return val;
                });

                // console.clear();
                dispatch(BlogIndexAction({categories, featured, popular, shop, tags}));
            })
            .catch(err => {
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

/******************/
/*   BLOG DETAIL  */
/******************/


export const blogDetail = (posts, slug) => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost('blog');

        axios
            .get(`${host}/p/${slug}`)
            .then(res => {

                let {post, related} = res.data;

                post.image = getPath(post.image, 'blog');
                post.related = related;
                dispatch(BlogDetailAction({post, blog_posts: posts}));
            })
            .catch(err => {
                console.error(err.toString());
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


/******************/
/*   COMMENTS     */
/******************/

export const blogUpdateComment = ({posts, slug, id, content}) => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost('blog');
        let post = posts[slug];

        // get token
        const token = localStorage.getItem("token");

        axios
            .put(`${host}/comment/${id}`, {
                content
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(res => {

                const {comment, msg} = res.data;

                // Remove the old comment
                _.remove(post.comments, item => item.id === id);

                // Then add the new comment
                post.comments = [...post.comments, comment];
                dispatch(BlogUpdateCommentAction({post, blog_posts: posts}));
                dispatch(sendFeedBackAction(
                    true,
                    msg
                    )
                );
            })
            .catch(err => {
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


export const blogDeleteComment = ({posts, slug, id}) => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost('blog');
        let post = posts[slug];

        // get token
        const token = localStorage.getItem("token");


        axios
            .delete(`${host}/comment/${id}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(res => {

                const {msg} = res.data;

                _.remove(post.comments, item => item.id === id);

                dispatch(BlogDeleteCommentAction({post, blog_posts: posts}));
                dispatch(sendFeedBackAction(
                    true,
                    msg
                    )
                );
            })
            .catch(err => {
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


export const blogAddComment = ({posts, slug, content}) => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost('blog');
        let post = posts[slug];

        // get token
        const token = localStorage.getItem("token");

        axios
            .post(`${host}/comment`, {
                content,
                subject: post.id,
                parent: null
            }, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(res => {

                let {comment} = res.data;

                post.comments = [...post.comments, comment];
                // post.image = getPath(post.image, 'blog');
                dispatch(BlogAddCommentAction({post, blog_posts: posts}));
            })
            .catch(err => {
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
export const blogSearch = (params, oldResults = []) => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost("blog");

        // query
        const query = params.q ? params.q : "";

        const page = params.p ? params.p : 1;
        // category
        const category = params.c ? params.c : "";

        let tags = params["tags[]"] ? params["tags[]"] : [];

        if (!_.isArray(tags)) {
            tags = [tags];
        }

        const data = {
            query,
            tags: _.join(tags, ";"),
            category,
            page
        };


        axios
            .post(`${host}/search`, data)
            .then(res => {

                let {results, total_pages, page, total_results} = res.data;

                if (page > 1) {
                    results = [...results, ...oldResults];
                }

                dispatch(blogResultsAction(results, total_results, page, total_pages));
            })
            .catch(err => {
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

/***********************/
/*      NEWSLETTER     */
/***********************/

export const subscribeNewsletter = (email) => {
    return dispatch => {
        dispatch(operationStartAction());

        let host = getHost("newsletter");


        axios
            .post(`${host}/subscribe`, {
                email
            })
            .then(res => {
                const {msg} = res.data;
                dispatch(sendFeedBackAction(
                        true,
                        msg
                    ))
            })
            .catch(err => {
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
