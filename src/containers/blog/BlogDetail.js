import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {blogDetail, blogIndex} from "../../actions/blog";

import ErrorPage from "../others/404";
import DetailContent from "../../components/blog/DetailContent";

// import {Link} from "react-router-dom";


class BlogDetail extends Component {
    // Properties Types
    static propTypes = {
        match: PropTypes.object.isRequired,
        posts: PropTypes.object,
        shop: PropTypes.arrayOf(PropTypes.object).isRequired,
        loading: PropTypes.bool.isRequired,
    };

    render() {
        const {loading, posts, match} = this.props;

        const post = posts[match.params.slug];

        return (
            <>
                {
                    post && loading ? (
                            <>
                                <DetailContent match={match} post={post}/>
                            </>
                        ) :
                        (
                            loading ? (
                                    <section className={"container p-5 text-center"}>
                                        <h2 className="h3" style={{
                                            fontWeight: 300
                                        }}>Récupération de votre article...</h2>
                                        <div className="spinner-grow text-primary text-center" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </section>
                                ) :
                                (
                                    post ? (
                                            <>
                                                <DetailContent match={match} post={post}/>
                                            </>
                                        ) :
                                        (
                                            <>
                                                <ErrorPage/>
                                            </>
                                        )
                                )
                        )
                }
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        posts: state.blog_posts,
        loading: state.loading,
        shop: state.blog_shop,
        match: ownProps.match,
    }
};

export default connect(mapStateToProps, null)(BlogDetail);
