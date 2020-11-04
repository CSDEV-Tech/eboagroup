import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import {
  faEye,
  faTrash,
  faMoneyBill
} from "@fortawesome/free-solid-svg-icons/index";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons/faShoppingBasket";
import _ from "lodash";
import { connect } from "react-redux";
import { checkCart, removeItemFromCart } from "../../actions";

class CartButton extends Component {
  static propTypes = {
    cart: PropTypes.shape({
      cartline_set: PropTypes.arrayOf(PropTypes.object).isRequired
    }).isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    checkCart: PropTypes.func.isRequired
  };

  componentDidMount(): void {
    const { checkCart } = this.props;
    checkCart();
  }

  render() {
    const { cart, onRemoveItem } = this.props;

    let items = [...cart.cartline_set, ...cart.promotions];
    let totalPrice = 0;
    // console.log(items, totalPrice);
    _.forEach(items, item => {
      if (!item.label) {
        const { article_related: article } = item;
        totalPrice += article.real_price * item.article_count;
        item.type = "article";
      } else {
        totalPrice += item.total;
        item.type = "promotion";
      }
    });

    return (
      <React.Fragment>
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle"
            data-toggle="dropdown"
            id="cardButtonDropDown"
          >
            <FontAwesomeIcon icon={faShoppingBasket} />{" "}
            <span className="badge badge-danger">{_.size(items)}</span>
          </button>
          <div
            className="dropdown-menu dropdown-menu-right"
            style={{
              minWidth: "250px",
              maxHeight: "400px",
              position: "absolute",
              transform: "translate3d(-87px, 43px, 0px); top: 0px; left: 0px",
              willChange: "transform",
              overflowY: "scroll"
            }}
          >
            <article className="p-3">
              {_.map(items, line => {
                if (line.type === "article") {
                  const { article_related: item } = line;
                  return (
                    <React.Fragment key={item.id}>
                      <figure className="media">
                        <div className="img-wrap">
                          <img
                            src={item.image1}
                            alt="item"
                            className="img-thumbnail img-xs"
                          />
                        </div>
                        <figcaption className="media-body">
                          <span className="text-primary">{item.name}</span>
                          <br />
                          <span
                            className="text-muted"
                            style={{
                              fontSize: ".8rem"
                            }}
                          >
                            PRIX : {item.real_price} FCFA
                          </span>{" "}
                          <br />
                          <span
                            className="text-muted"
                            style={{
                              fontSize: ".8rem"
                            }}
                          >
                            QUANTITE : {line.article_count}
                          </span>
                        </figcaption>

                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onRemoveItem(item)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </figure>
                      <hr />
                    </React.Fragment>
                  );
                } else {
                  const item = line;
                  return (
                    <React.Fragment key={item.id}>
                      <figure className="media">
                        <div className="img-wrap">
                          <img
                            src={item.image}
                            alt="item"
                            className="img-thumbnail img-xs"
                          />
                        </div>
                        <figcaption className="media-body">
                          <span className="text-primary">{item.label}</span>
                          <br />
                          <span
                            className="text-muted"
                            style={{
                              fontSize: ".8rem"
                            }}
                          >
                            PRIX : {item.total} FCFA
                          </span>{" "}
                          <br />
                          <span
                            className="text-muted"
                            style={{
                              fontSize: ".8rem"
                            }}
                          >
                            QUANTITE : 1
                          </span>
                        </figcaption>

                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onRemoveItem(item)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </figure>
                      <hr />
                    </React.Fragment>
                  );
                }
              })}
              <div className="text-success text-center mb-2">
                <FontAwesomeIcon icon={faMoneyBill} />
                Total : {totalPrice} FCFA
              </div>
              <div className="text-center mb-2">
                <Link className={"btn btn-primary"} to={"/cart"}>
                  {" "}
                  <FontAwesomeIcon icon={faEye} /> Voir le panier
                </Link>
              </div>
            </article>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRemoveItem: item => {
      dispatch(removeItemFromCart(item, item.type));
    },
    checkCart: () => dispatch(checkCart())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartButton);
