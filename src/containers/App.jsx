import React, {Component} from "react";
import BaseRouter from "./BaseRouter";
import {authCheckState, changePath, initApp, search} from "../actions";
import {connect} from "react-redux";
import queryString from "query-string";
import {createBrowserHistory} from "history";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import _ from "lodash";
import {deleteFlashAction} from "../actions/common";
import ErrorBoundary from './ErrorBoundary';
import {blogDetail, blogIndex, blogSearch} from "../actions/blog";

class App extends Component {
    // Can only create history inside a Component
    history = createBrowserHistory();

    static propTypes = {
        changePath: PropTypes.func.isRequired,
        msg: PropTypes.string,
        success: PropTypes.bool,
        autoSignup: PropTypes.func.isRequired,
        deleteFlash: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired,
        blogSearch: PropTypes.func.isRequired,
        init: PropTypes.func.isRequired,
        initBlog: PropTypes.func.isRequired,
        fetchPost: PropTypes.func.isRequired,
        posts: PropTypes.object.isRequired,
        results: PropTypes.arrayOf(PropTypes.object).isRequired,
        shop: PropTypes.arrayOf(PropTypes.object).isRequired,
        blogResults: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    showSwal = () => {
        const {msg, success, deleteFlash} = this.props;
        let path = this.history.location.pathname;
        if (
            path !== "/login" &&
            path !== "/signup" &&
            path !== "/forgot-password" &&
            path !== "/checkout"
        ) {
            msg &&
            Swal.fire({
                position: "top-end",
                showConfirmButton: false,
                text: msg,
                type: success ? "success" : "error",
                toast: true,
                timer: 3000,
                onClose: () => {
                    deleteFlash();
                }
            });
        }
    };

    componentDidUpdate() {
        this.showSwal();
        this.props.init();
    }

    componentDidMount() {
        // Get dispatch and history
        const {
            changePath,
            autoSignup: onAutoSignup,
            search,
            blogSearch,
            blogResults,
            results,
            shop,
            fetchPost,
            initBlog,
            posts,
        } = this.props;

        // signup automatically
        onAutoSignup();

        // show Swal
        this.showSwal();

        // path and query params
        let path = this.history.location.pathname;
        let params = queryString.parse(this.history.location.search);

        if (path !== "#") {
            changePath(path, params);
            if (path === "/search") {
                // alert("SHUT  !!!");
                this.launchSearch(params, results, search);
            }
        }

        this.history.listen(location => {
            let path = location.pathname;
            let params = queryString.parse(this.history.location.search);
            const {results} = this.props;
            changePath(path, params);


            if (path === "/search") {
                this.launchSearch(params, results, search);
            } else if (path === "/blog/search") {
                this.launchSearch(params, blogResults, blogSearch);
            } else if (path.startsWith("/articles/")) {
                let slug = path.substring(10);
                (shop.length === 0) && initBlog();
                let post = posts[slug];
                (!post) && fetchPost(posts, slug);
            }
        });
    }

    launchSearch = _.debounce(
        (params, oldResults, search) => search(params, oldResults),
        1000
    );

    render() {
        return (
            <React.Fragment>
                <ErrorBoundary>
                    <BaseRouter history={this.history}/>
                </ErrorBoundary>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        msg: state.feedback.msg,
        success: state.feedback.success,
        results: state.searchResults.items,
        blogResults: state.blogSearchResults.items,
        posts: state.blog_posts,
        shop: state.blog_shop,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changePath: (pathname, params) => dispatch(changePath(pathname, params)),
        autoSignup: () => dispatch(authCheckState()),
        deleteFlash: () => dispatch(deleteFlashAction()),
        init: () => dispatch(initApp()),
        // Wait for 1 sec before launching search
        search: (params, results = []) => dispatch(search(params, results)),
        blogSearch: (params, results = []) => dispatch(blogSearch(params, results)),
        fetchPost: (posts, slug) => dispatch(blogDetail(posts, slug)),
        initBlog: () => dispatch(blogIndex()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
