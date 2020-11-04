import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {faHeart, faShoppingCart, faTrash} from "@fortawesome/free-solid-svg-icons/index";
import Tooltip from "react-simple-tooltip";
import _ from 'lodash';
import {addItemToCart, getWishList, removeItemFromWishList} from "../../actions";
import {connect} from "react-redux";

// import productImg from "../utils/images/items/4.jpg";

class WishListPage extends Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
        onRemoveItem: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        getItems: PropTypes.func.isRequired,
    };

    componentDidMount(): void {
        this.props.getItems();
        document.title = `BoaGroUp' - Liste de souhaits`
    }

    render() {
        const {items, addToCart, onRemoveItem} = this.props;
        // console.log(items);
        return (
            <div className="starter-template mb-5 mt-5 container">
                <nav aria-label="breadcrumb" className="w-100">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                        <li className="breadcrumb-item"><Link to="/account">Compte</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Liste de souhaits</li>
                    </ol>
                </nav>

                <h1>Ma Liste de souhaits</h1>

                <div className="card mb-4">
                    {
                        _.size(items) === 0 ?
                            <div className="text-center d-table" style={{height: "400px"}}>
                                <div className="d-table-cell align-middle">
                                    <div id="empty-icon" className="text-secondary" style={{fontSize: "100px"}}>
                                        <FontAwesomeIcon icon={faHeart}/>
                                    </div>
                                    <div id="empty-text" style={{fontSize: "30px"}}>
                                        <b className="text-secondary">Votre liste de souhaits est vide</b>
                                    </div>
                                </div>
                            </div> :

                            <table
                                className="table table-hover shopping-cart-wrap table-responsive-md table-responsive-lg table-responsive-sm">
                                <thead className="text-muted">
                                <tr>
                                    <th scope="col">Produit</th>
                                    <th scope="col" width="120">Prix</th>
                                    <th scope="col" width="200" className="text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody>

                                {_.map(items,
                                    item => (
                                        <tr key={item.id}>
                                            <td>
                                                <figure className="media">
                                                    <div className="img-wrap">
                                                        <Link to={`/p/${item.slug}`}>
                                                            <img src={item.image1}
                                                                 className="img-thumbnail img-sm"
                                                                 alt="product-img"/>
                                                        </Link>
                                                    </div>

                                                    <figcaption className="media-body">
                                                        <h6 className="title text-truncate text-uppercase">
                                                            <Link to={`/p/${item.slug}`}>
                                                                {item.name}
                                                            </Link>
                                                        </h6>

                                                        <dl className="dlist-inline small">
                                                            <dt>Réduction :</dt>
                                                            {" "}
                                                            <dd>{item.reduction > 0 ? item.reduction + " %" : "Aucune"}</dd>
                                                        </dl>
                                                        <dl className="dlist-inline small">
                                                            <dt>Catégorie :</dt>
                                                            {" "}
                                                            <dd>{item.category.name}</dd>
                                                        </dl>
                                                        <dl className="dlist-inline small">
                                                            <dt>Nouveau :</dt>
                                                            {" "}
                                                            <dd> {item.is_new ? "Oui" : "Non"}</dd>
                                                        </dl>
                                                    </figcaption>
                                                </figure>
                                            </td>
                                            <td>
                                                <div className="price-wrap">
                                                    <var className="price">{item.real_price} FCFA</var>
                                                    {item.promotion ?
                                                        <del className="text-muted">({item.price} FCFA)</del> : null}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                {item.stock > 0 && (
                                                    <Tooltip content="Ajouter au panier"
                                                             customCss={`white-space: nowrap;`}>
                                                        <button className="btn btn-primary mb-2"
                                                                data-toggle="tooltip"
                                                                data-original-title="Save to Cart"
                                                                onClick={() => addToCart(item)}
                                                        >
                                                            <FontAwesomeIcon icon={faShoppingCart}/>
                                                        </button>
                                                    </Tooltip>
                                                )}
                                                {" "}
                                                <Tooltip content="Retirer"
                                                         customCss={`white-space: nowrap;`}>
                                                    <button className="btn btn-outline-danger mb-2"
                                                            onClick={() => onRemoveItem(item)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash}/>
                                                    </button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.wishlist.items,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onRemoveItem: (item) => {
            dispatch(removeItemFromWishList(item))
        },
        addToCart: (item) => {
            // remove and add item to wishlist
            dispatch(removeItemFromWishList(item));
            dispatch(addItemToCart(item, 1));
        },
        getItems: () => dispatch(getWishList())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WishListPage);