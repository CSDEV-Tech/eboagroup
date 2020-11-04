import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import ErrorPage from "../others/404";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {selectItemAction} from "../../actions/common";
import Tooltip from "react-simple-tooltip";
import {addItemToCart, addItemToWishList} from "../../actions";


class SaleDetailPage extends Component {

    static propTypes = {
        promotions: PropTypes.arrayOf(PropTypes.object).isRequired,
        addToCart: PropTypes.func.isRequired,
        setSelectedItem: PropTypes.func.isRequired,
        match: PropTypes.object.isRequired,
        isSignedIn: PropTypes.bool,
        addToWishList: PropTypes.func.isRequired,
    };

    componentDidMount(): void {
        document.title = `BoaGroUp' - Solde`;
    }

    render() {
        const {match, promotions, addToCart, setSelectedItem, isSignedIn, addToWishList} = this.props;
        const slug = match.params.slug;

        let sale = _.find(promotions, (item) => (item.slug === slug));

        let host = window.location.host;

        if (host === "localhost:3000") {
            host = "http://localhost:8001";
        } else {
            host = "";
        }

        return (
            sale ? (
                    <>
                        <header className="header mb-5">
                            <div className="header-content section-pagetop bg-secondary"
                                 style={{
                                     backgroundImage: `url(${sale.image})`,
                                     backgroundPosition: `center`,
                                     backgroundSize: `cover`,
                                     backgroundRepeat: `no-repeat`,
                                     height: "250px",
                                     overflow: "hidden",
                                 }}>
                                <div className="overlay"
                                     style={{
                                         backgroundColor: "rgba(0,0,0, .55)"
                                     }}>
                                </div>
                                <div className="w-100 ml-md-5 mr-md-5 pl-5 pr-5">
                                    <h1 className="title-page my-title text-uppercase" style={{
                                        opacity: 1,
                                    }}>
                                        {sale.label}&nbsp;
                                        <small>
                                            <div className="badge badge-warning">{sale.total} FCFA</div>
                                        </small>
                                        <br/>
                                        <div className="small">
                                                <div className="badge badge-secondary">
                                                au lieu de <del>{sale.presumed_price} FCFA</del>
                                            </div>
                                        </div>
                                    </h1>
                                    <h2 className={"my-subtitle"}>
                                        {sale.description}
                                    </h2>
                                    <button className="btn btn-danger" onClick={() => addToCart(sale)}>
                                        <div>
                                            <FontAwesomeIcon icon={faShoppingCart}/> J'achète !
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </header>

                        <section className={"container mb-5"}>
                            <header className="section-heading heading-line" style={{
                                // maxWidth: "700px"
                            }}>
                                <h4 className="title-section bg-light text-uppercase">Détails du deal</h4>
                            </header>

                            <div className="card mb-4">
                                <table
                                    className="table table-hover shopping-cart-wrap table-responsive-md table-responsive-lg table-responsive-sm">
                                    <thead className="text-muted">
                                    <tr>
                                        <th scope="col">Produit</th>
                                        <th scope="col" width="200">Quantité</th>
                                        <th scope="col" width="120">Prix unitaire</th>
                                        <th scope="col" width="200" className="text-right">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {_.map(sale.promotionline_set, item => (
                                            <tr key={item.article_related.id}>
                                                <td>
                                                    <figure className="media">
                                                        <div className="img-wrap">
                                                            <Link to={`/p/${item.article_related.slug}`}>
                                                                <img
                                                                    src={`${(host === "http://localhost:8001") ? host : ""}${item.article_related.image1}`}
                                                                    className="img-thumbnail img-sm"
                                                                    alt="product-img"/>
                                                            </Link>
                                                        </div>
                                                        <figcaption className="media-body">
                                                            <Link to={`/p/${item.article_related.slug}`}>
                                                                <h6 className="title text-truncate text-uppercase text-primary">
                                                                    {item.article_related.name}
                                                                </h6>
                                                            </Link>
                                                            <dl className="dlist-inline">
                                                                {" "}
                                                                <dd>{item.article_related.reduction > 0 && (
                                                                    <div className={"badge badge-danger"}>
                                                                        {item.article_related.reduction} % de réduction
                                                                    </div>
                                                                )}</dd>
                                                            </dl>
                                                            <dl className="dlist-inline">
                                                                <dd> {item.article_related.is_new && (
                                                                    <div className={"badge badge-warning"}>
                                                                        Nouveau
                                                                    </div>
                                                                )}</dd>
                                                            </dl>
                                                        </figcaption>
                                                    </figure>
                                                </td>
                                                <td>
                                                    <input style={{
                                                        width: "50px"
                                                    }} className={"form-control disabled"} type={"text"} readOnly
                                                           value={`${item.article_count}`}/>
                                                </td>
                                                <td>
                                                    <div className="price-wrap">
                                                        <var
                                                            className="price">{item.article_related.real_price} FCFA
                                                        </var>
                                                        {item.article_related.reduction > 0 && (
                                                            <del
                                                                className={"text-secondary"}>{item.article_related.price} FCFA</del>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <Tooltip content="J'achète !"
                                                             customCss={`white-space: nowrap;`}>
                                                        <button className="btn btn-primary mb-2"
                                                                onClick={(event => setSelectedItem(item.article_related))}>
                                                            <FontAwesomeIcon icon={faShoppingCart}/>
                                                        </button>
                                                    </Tooltip>
                                                    {" "}
                                                    {isSignedIn && (
                                                        <Tooltip content="Peut-être plus tard"
                                                                 customCss={`white-space: nowrap;`}>
                                                            <button className="btn btn-danger mb-2"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Save to Wishlist" onClick={
                                                                event => addToWishList(item.article_related)
                                                            }>
                                                                <FontAwesomeIcon icon={faHeart}/>
                                                            </button>
                                                        </Tooltip>

                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                ) :
                <>
                    <ErrorPage/>
                </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        promotions: state.promotions,
        isSignedIn: !!state.account.token,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addToCart: (sale) => {
            // TODO : Finish this
            console.log(sale);
            dispatch(addItemToCart(sale, 1, "promotion"));
        },
        setSelectedItem: item => {
            dispatch(selectItemAction(item));
        },
        addToWishList: (item) => {
            // remove and add item to wishlist
            dispatch(addItemToWishList(item));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleDetailPage);
