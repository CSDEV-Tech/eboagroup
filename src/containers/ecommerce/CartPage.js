import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {faHeart, faShoppingCart, faTrash} from "@fortawesome/free-solid-svg-icons/index";
import Tooltip from "react-simple-tooltip";
import _ from 'lodash';
import {addItemToCart, addItemToWishList, checkCart, removeItemFromCart} from "../../actions";
import {connect} from "react-redux";

class CartPage extends Component {

    static propTypes = {
        cart: PropTypes.object.isRequired,
        updateItem: PropTypes.func.isRequired,
        addToWishList: PropTypes.func.isRequired,
        onRemoveItem: PropTypes.func.isRequired,
        checkCart: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool,
    };

    componentDidMount() {
        const {checkCart} = this.props;
        checkCart();

        document.title = `BoaGroUp' - Panier`
    }

    render() {
        const {cart, updateItem, addToWishList, onRemoveItem, isSignedIn} = this.props;

        let totalPrice = 0;
        const items = [...cart.cartline_set, ...cart.promotions];

        // console.log(items);
        _.forEach(items, (item => {
            if (!item.label) {
                const {article_related: article} = item;
                totalPrice += article.real_price * item.article_count;
                item.type = "article";
            } else {
                totalPrice += item.total;
                item.type = "promotion";
            }
        }));

        // return (<></>);

        return (
            <div className="starter-template mb-5 mt-5 container">
                <nav aria-label="breadcrumb" className="w-100">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Panier</li>
                    </ol>
                </nav>

                <h1>Votre Panier</h1>

                {/*{(totalPrice < 5000 && _.size(items) > 0) && (*/}
                {/*    <div*/}
                {/*        className={`alert alert-danger alert-dismissible`}>*/}
                {/*        Vous ne pouvez pas valider un panier de moins de 5000 FCFA <br/>*/}
                {/*    </div>*/}
                {/*)}*/}

                <div className="card mb-4">
                    {
                        _.size(items) === 0 ?
                            <div className="text-center d-table" style={{height: "300px"}}>
                                <div className="d-table-cell align-middle">
                                    <div id="empty-icon" className="text-secondary" style={{fontSize: "100px"}}>
                                        <FontAwesomeIcon icon={faShoppingCart}/>
                                    </div>
                                    <div id="empty-text" style={{fontSize: "30px"}}>
                                        <b className="text-secondary">Votre panier est vide</b>
                                    </div>
                                </div>
                            </div> :

                            <table
                                className="table table-hover shopping-cart-wrap table-responsive-md table-responsive-lg table-responsive-sm">
                                <thead className="text-muted">
                                <tr>
                                    <th scope="col">Produit</th>
                                    <th scope="col" width="200">Quantité</th>
                                    <th scope="col" width="120">Prix</th>
                                    <th scope="col" width="200" className="text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {_.map(items,
                                    item => (
                                        (item.type === "article") ?
                                            (
                                                <tr key={item.article_related.id}>
                                                    <td>
                                                        <figure className="media">
                                                            <div className="img-wrap">
                                                                <Link to={`/p/${item.article_related.slug}`}>
                                                                    <img src={item.article_related.image1}
                                                                         className="img-thumbnail img-sm"
                                                                         alt="product-img"/>
                                                                </Link>
                                                            </div>
                                                            <figcaption className="media-body">
                                                                <Link to={`/p/${item.article_related.slug}`}>
                                                                    <h6 className="title text-truncate text-uppercase text-dark">
                                                                        <b>
                                                                            {item.article_related.name}
                                                                        </b>
                                                                    </h6>
                                                                </Link>
                                                                <dl className="dlist-inline">
                                                                    {" "}
                                                                    <dd>{item.article_related.reduction > 0 && (
                                                                        <div className={"badge badge-danger"}>
                                                                            {item.article_related.reduction} % de
                                                                            réduction
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
                                                        <div className="input-group">
                                                            <div className="input-group-prepend">
                                                                <button
                                                                    className={`btn btn-secondary 
                                                            ${item.article_count === 1 && 'disabled'}`}
                                                                    type="button"
                                                                    disabled={item.article_count === 1}
                                                                    onClick={
                                                                        (e) => (updateItem(item.article_related, item.article_count - 1))
                                                                    }
                                                                >
                                                                    -
                                                                </button>
                                                            </div>
                                                            <input className="form-control text-center" type="text"
                                                                   value={item.article_count}
                                                                   style={{maxWidth: "40px", width: "40px"}}
                                                                   readOnly
                                                            />
                                                            <div className="input-group-append">
                                                                <button className={`btn btn-secondary 
                                                            ${item.article_count === item.article_related.stock && 'disabled'}`}
                                                                        type="button"
                                                                        disabled={item.article_count === item.article_related.stock}
                                                                        onClick={
                                                                            (e) => (updateItem(item.article_related, item.article_count + 1))
                                                                        }
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="price-wrap">
                                                            <var
                                                                className="price">{item.article_related.real_price * item.article_count} FCFA</var>
                                                            <small
                                                                className="text-muted">({item.article_related.real_price} FCFA
                                                                chacun)
                                                            </small>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        {isSignedIn && (
                                                            <Tooltip content="Ajouter à la liste de souhaits"
                                                                     customCss={`white-space: nowrap;`}>
                                                                <button className="btn btn-primary mb-2"
                                                                        data-toggle="tooltip"
                                                                        data-original-title="Save to Wishlist" onClick={
                                                                    () => addToWishList(item.article_related)
                                                                }>
                                                                    <FontAwesomeIcon icon={faHeart}/>
                                                                </button>
                                                            </Tooltip>

                                                        )}
                                                        {" "}
                                                        <Tooltip content="Retirer"
                                                                 customCss={`white-space: nowrap;`}>
                                                            <button className="btn btn-outline-danger mb-2" onClick={
                                                                () => onRemoveItem(item.article_related, "article")
                                                            }>
                                                                <FontAwesomeIcon icon={faTrash}/>
                                                            </button>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ) :
                                            (
                                                <tr key={item.id}>
                                                    <td>
                                                        <figure className="media">
                                                            <div className="img-wrap">
                                                                <Link to={`/sales/${item.slug}`}>
                                                                    <img src={item.image}
                                                                         className="img-thumbnail img-sm"
                                                                         alt="product-img"/>
                                                                </Link>
                                                            </div>
                                                            <figcaption className="media-body">
                                                                <Link to={`/sales/${item.slug}`}>
                                                                    <h6 className="title text-truncate text-uppercase text-dark">
                                                                        <b>{item.label}</b>
                                                                    </h6>
                                                                </Link>
                                                            </figcaption>
                                                        </figure>
                                                    </td>
                                                    <td>
                                                        <div className="input-group">
                                                            <input className="form-control text-center" type="text"
                                                                   value={1}
                                                                   style={{maxWidth: "40px", width: "40px"}}
                                                                   readOnly
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="price-wrap">
                                                            <var
                                                                className="price">{item.total} FCFA</var>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <Tooltip content="Retirer"
                                                             customCss={`white-space: nowrap;`}>
                                                        <td className="text-right">
                                                            <button className="btn btn-outline-danger mb-2" onClick={
                                                                () => onRemoveItem(item, "promotion")
                                                            }>
                                                                <FontAwesomeIcon icon={faTrash}/>
                                                            </button>

                                                        </td>
                                                    </Tooltip>
                                                    </td>
                                                </tr>
                                            )
                                    )
                                )}
                                </tbody>
                            </table>
                    }

                </div>

                <nav aria-label="breadcrumb" className="w-100">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><h4>Total : {totalPrice} FCFA</h4></li>
                    </ol>
                </nav>

                <div className="p-sm-2 p-md-0 p-2">
                    <div className="row">
                        <div className="col-md-5 col-6"/>
                        {_.size(items) === 0 ?
                            <div className="col-md-4 offset-md-3">
                                <Link to="/search">
                                    <button className="btn btn-primary btn-lg w-100 mb-2">
                                        Faire un nouvel achat
                                    </button>
                                </Link>
                            </div>
                            : <React.Fragment>
                                <div className="col-md-3">
                                    <Link to="/search">
                                        <button className="btn btn-outline-secondary btn-lg w-100 mb-2"
                                                style={{
                                                    // border: "2px solid #000"
                                                }}>
                                            Continuer vos achats
                                        </button>
                                    </Link>
                                </div>
                                {/*{(totalPrice >= 5000) && (*/}
                                <div className="col-md-4">
                                    <Link to="/checkout">
                                        <button
                                            className="btn btn-primary btn-lg mb-2 w-100 mb-md-2">
                                            Finaliser la commande
                                        </button>
                                    </Link>
                                </div>
                                {/*)}*/}
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        isSignedIn: !!state.account.token,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onRemoveItem: (item, type) => {
            dispatch(removeItemFromCart(item, type))
        },
        addToWishList: (item) => {
            // remove and add item to wishlist
            dispatch(removeItemFromCart(item));
            dispatch(addItemToWishList(item));
        },
        updateItem: (item, count) => {
            dispatch(addItemToCart(item, count))
        },
        checkCart: () => dispatch(checkCart())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);

