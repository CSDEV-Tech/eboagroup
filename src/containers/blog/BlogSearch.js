import React, {Component} from "react";
import queryString from "query-string/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faPlus, faArrowUp} from "@fortawesome/free-solid-svg-icons";
// import ItemProduct from "../../components/ecommerce/partials/CardItemProduct";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import {setPageAction} from "../../actions/ecommerce/search";
import SearchFilters from "../../components/ecommerce/partials/SearchFilters";
import ModalSearchFilters from "../../components/ecommerce/ModalSearchFilters";
import {spring} from "react-flip-toolkit";
import FlipMove from "react-flip-move";

import $ from "jquery";
import CardArticle from "../../components/blog/partials/CardArticle";
import {blogIndex} from "../../actions/blog";

class BlogSearch extends Component {
    static propTypes = {
        results: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
        shop: PropTypes.arrayOf(PropTypes.object).isRequired,
        tags: PropTypes.arrayOf(PropTypes.object).isRequired,
        changePage: PropTypes.func.isRequired,
        initBlog: PropTypes.func.isRequired,
    };

    state = {
        searchQuery: "",
        searchCategory: null,
        orderBy: 0,
        page: 1,
        curUrl: undefined
    };

    componentWillMount() {
        const {categories} = this.props;
        const params = queryString.parse(window.location.search);

        this.setParams(params, categories);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {categories} = nextProps;
        const params = queryString.parse(window.location.search);

        this.setParams(params, categories);
    }

    componentDidMount() {
        const {searchQuery} = this.state;
        const {initBlog, shop} = this.props;

        document.title = `BoaGroUp' - Recherche ${searchQuery}`;

        (shop.length === 0) && initBlog();

        $("#up").click(e => {
            $("html, body").animate(
                {
                    scrollTop: $("#top").offset().top
                },
                1000
            );
        });
    }

    setParams = (params, categories) => {
        // query
        const searchQuery = params.q ? params.q : "";

        // category
        const category_slug = params.c ? params.c : "";

        let searchCategory = _.find(categories, c => c.slug === category_slug);

        // order
        let orderBy = Number.parseInt(params.o ? params.o : 0);

        // the current page
        let page = Number.parseInt(params.page ? params.page : 1);

        // Must be a number
        if (isNaN(orderBy)) {
            orderBy = 0;
        }

        if (isNaN(page)) {
            page = 1;
        }

        let selected_tags = params["tags[]"] ? params["tags[]"] : [];

        if (!_.isArray(selected_tags)) {
            selected_tags = [selected_tags];
        }


        // Construct Url
        const curUrl = this.constructUrl(
            searchCategory,
            selected_tags,
            searchQuery,
            page
        );

        // alert("PARAMS SET ! : " + curUrl);
        // set category and query
        this.setState({
            searchQuery,
            searchCategory,
            orderBy,
            curUrl
        });
    };

    searchMore = page => {
        const {results, changePage} = this.props;
        changePage(results, page);
        const {categories, history} = this.props;
        const params = queryString.parse(window.location.search);

        // query
        const query = params.q ? params.q : "";

        // category
        const category_slug = params.c ? params.c : "";

        let selected_tags = params["tags[]"] ? params["tags[]"] : [];

        if (!_.isArray(selected_tags)) {
            selected_tags = [selected_tags];
        }

        // // console.log("PARAMS ==> ", params);
        let selected_category = _.find(categories, c => c.slug === category_slug);

        // Construct Url
        const url = this.constructUrl(
            selected_category,
            selected_tags,
            query,
            page
        );

        // go to search
        history.push(`/blog/search?${url}`);
    };

    constructUrl = (category, tags = [], query = "", page = 1) => {
        let url = `q=${window.encodeURI(query)}`;

        if (category) {
            url = `${url}&c=${category.slug}`;
        }

        for (let i = 0; i < tags.length; i++) {
            url = `${url}&tags[]=${window.encodeURI(tags[i])}`;
        }

        if (!isNaN(Number.parseInt(page))) {
            url = `${url}&p=${page}`;
        }

        return url;
    };

    onElementAppear = (el, index) => {
        spring({
            targets: el,
            opacity: 0,
            delay: index * 20,
            duration: 150,
            easing: "easeOutSine"
        });
    };

    onElementExit = (el, index, removeElement) => {
        spring({
            targets: el,
            opacity: 0,
            duration: 150,
            complete: removeElement,
            delay: index * 20,
            easing: "easeOutSine"
        });
    };

    render() {
        const {results} = this.props;
        let {items, num_pages, current_page, totalCount} = results;
        const {searchCategory, searchQuery, orderBy} = this.state;

        items.length > 0 &&
        window.addEventListener("scroll", () => {
            let $footer = $("#footer");
            if ($footer.length > 0) {
                if (
                    document.documentElement.scrollTop >= 250 &&
                    document.documentElement.scrollTop <= $footer[0].offsetTop - 700
                ) {
                    $("#aside").addClass("fixed-left");
                } else {
                    $("#aside").removeClass("fixed-left");
                }

                if (document.documentElement.scrollTop > 380) {
                    $("#modal-filters").addClass("fixed-filters");
                } else {
                    $("#modal-filters").removeClass("fixed-filters");
                }
            }
        });

        if (orderBy === 2) {
            items = _.orderBy(items, "title", "asc");
        }

        return (
            // PAGE TOP
            <div className="starter-template">
                <section className="section-pagetop bg-secondary">
                    <div className="container-fluid clearfix">
                        <h2 className="title-page">Résultats pour "{searchQuery}"</h2>
                        <nav className="float-left">
                            <ol className="breadcrumb text-white">
                                <li className="breadcrumb-item">
                                    <Link to="/blog">Blog</Link>
                                </li>
                                <React.Fragment>
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={`${
                                                searchCategory
                                                    ? "/blog/search?c=" + searchCategory.slug
                                                    : "/blog/search"
                                                }`}
                                        >
                                            {searchCategory ? searchCategory.name : "Tout"}
                                        </Link>
                                    </li>

                                    <li className="breadcrumb-item active">Résultats</li>
                                </React.Fragment>
                            </ol>
                        </nav>
                    </div>
                </section>

                <section className="section-content bg padding-y" id="top">
                    <div className="showOnPhone mb-4">
                        <div className="m-auto d-flex flex-column align-items-center">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-toggle="modal"
                                data-target="#filtersModal"
                                id="modal-filters"
                                style={{
                                    zIndex: 900
                                }}
                            >
                                Filtres <FontAwesomeIcon icon={faFilter}/>
                            </button>
                        </div>

                        <ModalSearchFilters
                            tags={this.props.tags}
                            categories={this.props.categories}
                            linkPrefix={"/blog"}
                            history={this.props.history}
                        />
                    </div>

                    <div className="container-fluid pl-5 pr-5">
                        <div className="row">
                            {/*FILTERS*/}
                            <aside className="col-md-3 hideOnPhone">
                                <div id="aside">
                                    <div className="card">
                                        <div className="card-body">
                                            <SearchFilters
                                                tags={this.props.tags}
                                                categories={this.props.categories}
                                                linkPrefix={"/blog"}
                                                history={this.props.history}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/*RESULTS*/}
                            <main className="col-md-9 col-12">
                                <header className="border-bottom mb-4 pb-3">
                                    <div className="form-inline">
                                        <span className="mr-md-auto mb-2">
                                          {totalCount} élément{totalCount !== 1 && "s"} trouvé
                                            {totalCount !== 1 && "s"}
                                        </span>
                                        &nbsp;&nbsp;
                                        <select
                                            className="mr-2 form-control mb-2"
                                            id={"sort"}
                                            name={"order"}
                                            value={orderBy}
                                            onChange={event =>
                                                this.setState({
                                                    orderBy: Number.parseInt(event.target.value)
                                                })
                                            }
                                        >
                                            <option value={0}>Trier par...</option>
                                            <option value={1}>Plus récents</option>
                                            <option value={2}>Titre de l'article</option>
                                        </select>
                                    </div>
                                </header>

                                {/*PRODUCTS */}

                                <div className="row">
                                    <FlipMove typeName={null}
                                    >
                                        {items.map((item) => (
                                            <div
                                                className="col-xl-4 col-lg-4 col-md-6 col-sm-12"
                                                key={item.id}
                                            >
                                                <CardArticle item={item} key={item.id}/>
                                            </div>
                                        ))}
                                    </FlipMove>
                                </div>
                            </main>
                        </div>
                    </div>

                    <div className="m-auto d-flex flex-column align-items-center">
                        <div className="d-flex flex-row">
                            {num_pages > 1 && current_page < num_pages && (
                                <button
                                    className="btn btn-primary"
                                    onClick={e => this.searchMore(current_page + 1)}
                                >
                                    {" "}
                                    Voir plus <FontAwesomeIcon icon={faPlus}/>{" "}
                                </button>
                            )}
                            &nbsp;&nbsp;
                            <button id="up" className="btn btn-secondary">
                                Retour en haut <FontAwesomeIcon icon={faArrowUp}/>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        results: state.blogSearchResults,
        history: ownProps.history,
        categories: state.blog_categories,
        tags: state.blog_tags,
        shop: state.blog_shop,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        search: ({query, category, filters, tags, page = 1}) => {
            // console.log("QUERY ==>", {query, category, filters, tags, page});
            // dispatch(search(client, {category: cat, query, promo, tags}))
        },
        changePage: (res, page) => dispatch(setPageAction(res, page)),
        initBlog: () => dispatch(blogIndex())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlogSearch);
