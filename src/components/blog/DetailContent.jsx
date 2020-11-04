import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";
import ProductSlider from "../../components/ecommerce/partials/ProductSlider";
import PropTypes from "prop-types";
import _ from "lodash";
import {Link} from "react-router-dom";
import {getMonth} from "../../utils/functions";
import {faTwitter} from "@fortawesome/free-brands-svg-icons";
import moment from 'moment';
import 'moment/locale/fr'
import {blogAddComment, blogDeleteComment, blogUpdateComment} from "../../actions/blog";
import ArticleSlider from "./ArticleSlider";
import CommentForm from "./partials/CommentForm";
import SingleComment from "./partials/SingleComment";


class DetailContent extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        posts: PropTypes.object.isRequired,
        shop: PropTypes.arrayOf(PropTypes.object).isRequired,
        isSignedIn: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        userId: PropTypes.number,
        addComment: PropTypes.func.isRequired,
        deleteComment: PropTypes.func.isRequired,
        updateComment: PropTypes.func.isRequired,
    };


    componentDidMount(): void {
        document.title = "BoaGroUp' - Détail de l'article";
    }

    render() {
        const {post, isSignedIn, shop, isLoading, addComment, posts, userId, deleteComment, updateComment} = this.props;
        moment.locale('fr');

        return (
            <>
                {/*Section Post Title*/}
                <section className="pb-0 pb-5 pt-5">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-10 col-xl-8">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link to={`/blog`}>Blog</Link>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <Link
                                                    to={`/blog/search?c=${post.category.slug}`}>{post.category.name}</Link>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                                <h1>{post.title}</h1>
                                <div className="d-flex align-items-center">
                                    {/*<a href="#">*/}
                                    {/*<img src="assets/img/avatars/male-1.jpg" alt="Avatar" className="avatar mr-2"/>*/}
                                    {/*</a>*/}
                                    <div>
                                        <div>Ecrit Par {post.author.name}
                                        </div>
                                        <div className="text-small text-muted">
                                            Publié le {post.published_at.day}{" "}
                                            {getMonth(post.published_at.month)}{" "}
                                            {post.published_at.year}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*   Section Article Content */}
                <section className="p-0" data-reading-position="">
                    <div className="container-fluid">
                        <div className="row justify-content-center position-relative pb-5">
                            <div className="col-lg-10 col-xl-8">
                                <img src={`${post.image}`} alt={`${post.title}`} className="rounded"/>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-xl-7 col-lg-8 col-md-10">
                                <article className="article" dangerouslySetInnerHTML={{
                                    __html: post.content
                                }}>
                                </article>

                                <div>
                                    <span><b className={"text-uppercase"}>Mot-clés: </b></span>&nbsp;&nbsp;
                                    {
                                        post.tags.map(tag => (
                                                <Link
                                                    to={`/blog/search?tags[]=${tag.tag}`}
                                                    className={"btn btn-sm ml-2 mb-2 border border-primary"}
                                                    key={tag.id}
                                                    style={{
                                                        color: "#444bf8",
                                                        backgroundColor: "#e9eafd",
                                                    }}
                                                >
                                                    {tag.tag}
                                                </Link>
                                            )
                                        )
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </section>


                {/* Section Comment */}
                <section className="has-divider mb-4">
                    <div className="container-fluid pt-3">
                        <div className="row justify-content-center">
                            <div className="col-xl-7 col-lg-8 col-md-10">
                                {/*Section Social Share*/}
                                <hr/>
                                <div className="d-flex align-items-center">
                                    <span className="text-small mr-1">Partager cet article :</span>
                                    <div className="d-flex mx-2">
                                        <a className="btn rounded btn-outline-info d-table text-center"
                                           target={"_blank"}
                                           href={`https://twitter.com/intent/tweet?text=Suivez%20cet%20article%20en%20ligne%20sur%20le%20blog%20de%20BoaGroUp'%20:%20${post.title}%20https://eboagroup.com/articles/${post.slug}`}
                                           style={{
                                               // border: "2px solid",
                                               width: "25px",
                                               height: "25px",
                                               fontSize: ".9rem",
                                           }}>
                                            <span
                                                className={"d-table-cell align-middle"}>
                                                <FontAwesomeIcon icon={faTwitter}/>
                                            </span>
                                        </a>
                                        &nbsp;&nbsp;
                                        <iframe
                                            src={`https://www.facebook.com/plugins/share_button.php?href=https://eboagroup.com/articles/${post.slug}&layout=button&size=large&width=93&height=28&appId`}
                                            width="93" height="28" style={{
                                            marginTop: ".1rem",
                                            border: "none",
                                            overflow: "hidden"
                                        }} scrolling="no"
                                            frameBorder="0" allowTransparency="true" allow="encrypted-media"/>
                                    </div>
                                </div>
                                <hr/>

                                {/*Section Shop*/}
                                {
                                    shop.length > 0 && (
                                        <ProductSlider classes={"mb-4"} products={shop}
                                                       hr
                                                       maxItems={3}
                                                       title={"Faites un tour sur notre boutique"}/>
                                    )
                                }

                                <hr/>

                                {/*Section Comment*/}
                                <h5 className="my-4"> {_.size(post.comments) === 0 ?
                                    <span>Aucun commentaire pour l'instant</span> : (
                                        <span> {_.size(post.comments)} Commentaire{_.size(post.comments) !== 1 && "s"}</span>)} {} </h5>
                                <ol className="comments">
                                    {
                                        post.comments.map(comment => (
                                            <SingleComment
                                                key={comment.id}
                                                comment={comment}
                                                userId={userId}
                                                isSignedIn={isSignedIn}
                                                deleteComment={() => deleteComment(posts, post.slug, comment.id)}
                                                updateComment={(newContent) => {
                                                    updateComment(posts, post.slug, comment.id, newContent)
                                                }}
                                            />
                                        ))
                                    }
                                </ol>

                                <hr/>

                                {
                                    !isSignedIn ? (
                                        <div className={"text-center"}><Link to={"/login"}>Connectez-vous</Link> pour
                                            commenter</div>
                                    ) : (
                                        <>
                                            <CommentForm
                                                onSubmit={(content) => addComment(posts, post.slug, content)}
                                                isLoading={isLoading}
                                            />
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Related */}
                {
                    post.related.length > 0 && (
                        <section className="has-divider mb-4">
                            <div className="container-fluid pt-3">
                                <div className="row justify-content-center">
                                    <div className="col-xl-7 col-lg-8 col-md-10">
                                        <hr/>
                                        <h5 className="mb-4 text-uppercase">Articles Similaires</h5>
                                        {
                                            <ArticleSlider items={post.related}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }
            </>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        post: ownProps.post,
        posts: state.blog_posts,
        isSignedIn: !!state.account.token,
        userId: state.account.id,
        shop: state.blog_shop,
        isLoading: state.loading,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addComment: (posts, slug, content) => dispatch(blogAddComment({posts, slug, content})),
        deleteComment: (posts, slug, id) => dispatch(blogDeleteComment({posts, slug, id})),
        updateComment: (posts, slug, id, content) => dispatch(blogUpdateComment({posts, slug, id, content})),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailContent);
