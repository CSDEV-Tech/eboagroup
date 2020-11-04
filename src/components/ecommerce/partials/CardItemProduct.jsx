import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {
    faHeart,
    faSearchPlus,
    faShoppingCart,
    faStar
} from "@fortawesome/free-solid-svg-icons/index";
import Tooltip from "react-simple-tooltip";
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import _ from "lodash";
import {selectItemAction} from "../../../actions/common";
import {addItemToWishList} from "../../../actions";

const CardItemProduct = ({
                             item,
                             addToWishList,
                             setSelectedItem,
                             isSignedIn
                         }) => {
    // item.description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab assumenda consequuntur dicta eos inventore molestiae nesciunt numquam perferendis quae quaerat, quibusdam quisquam quod recusandae reiciendis repellat sequi suscipit, temporibus velit!";
    item.extrait = _.truncate(item.name, {length: 39});

    if (item.image1_url) {
        item.image = item.image1_url;
    }
    //
    // if(window.location.host === "localhost:3000") {
    //         item.image = `http://localhost:8001${item.image}` ;
    // }

    // console.log("Images ==>", item.image, item.image1_url);

    // item.extrait = item.description;
    let width = (item.evaluation * 100) / 5;

    return (
        <figure
            className="card card-product"
            style={{
                // height: "530px",
                // maxHeight: "530px"
            }}
            id={`card-product-${item.id}`}
        >
            <Link to={`/p/${item.slug}`}>
                {item.is_new === "Oui" && <span className="badge-new"> NOUVEAU </span>}
                {!item.stock && <span className="badge-no-one-left">EPUISE</span>}
                {item.reduction > 0 && (
                    <span className="badge-offer">
            <b> - {item.reduction}%</b>

          </span>
                )}
                <div className="img-wrap d-flex align-items-center flex-row">
                    <img
                        className="center-x"
                        src={item.image}
                        alt="product-img"
                        style={{maxHeight: "100%", width: "auto"}}
                    />
                    <span className="btn-overlay">
            <FontAwesomeIcon icon={faSearchPlus}/> Quick view
          </span>
                </div>
            </Link>

            <figcaption className="info-wrap text-dark">
                <h4 className="title product__title">{item.extrait}</h4>
                <div className="rating-wrap">
                    <ul
                        className="rating-stars card-item-rating"
                        style={{
                            color: "#c0c0c0",
                            // fontSize: ".8rem"
                        }}
                    >
                        <li
                            style={{width: `${width}%`}}
                            className="stars-active text-warning"
                        >
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                            <FontAwesomeIcon icon={faStar}/>
                        </li>
                    </ul>
                </div>
            </figcaption>
            <div
                className="bottom-wrap"
                style={{
                    height: "82px",
                    maxHeight: "82px"
                }}
            >
                <div className="price-wrap h5 text-dark">
                  <span className="price-new product__real_price">
                    {item.real_price} FCFA
                  </span>{" "}
                    <br/>
                </div>
                <div className="float-right">
                    {item.stock > 0 && (
                        <React.Fragment>
                            <Tooltip
                                content="Ajouter au panier"
                                customCss={`white-space: nowrap;`}
                            >
                                <button
                                    className="btn btn-sm btn-outline-primary small-btn"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <FontAwesomeIcon icon={faShoppingCart}/>
                                </button>
                            </Tooltip>{" "}
                        </React.Fragment>
                    )}
                    {isSignedIn && (
                        <React.Fragment>
                            <Tooltip content="Ajouter à la liste de souhaits">
                                <button
                                    className="btn btn-sm btn-outline-danger small-btn"
                                    onClick={() => addToWishList(item)}
                                >
                                    <FontAwesomeIcon icon={faHeart}/>
                                </button>
                            </Tooltip>{" "}
                        </React.Fragment>
                    )}
                </div>

            </div>
        </figure>
    );
};

const mapStateToProps = state => {
    return {
        isSignedIn: state.account.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addToWishList: item => {
            dispatch(addItemToWishList(item));
        },
        setSelectedItem: item => {
            dispatch(selectItemAction(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardItemProduct);

CardItemProduct.propTypes = {
    item: PropTypes.object.isRequired,
    isSignedIn: PropTypes.bool,
    addToWishList: PropTypes.func.isRequired,
    setSelectedItem: PropTypes.func.isRequired
};
