import React, {Component} from "react";
// import {generateProducts} from "../utils/functions";
import $ from 'jquery';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {selectItemAction} from "../../actions/common";
import {addItemToCart} from "../../actions";

class ModalAddProduct extends Component {

    state = {
        item: null
    };

    // static defaultProps = {
    //     item: generateProducts()[0]
    // };

    static propTypes = {
        item: PropTypes.object.isRequired,
        addToCart: PropTypes.func.isRequired,
        removeItemSelected: PropTypes.func.isRequired,
    };

    componentDidMount(): void {
        const {removeItemSelected} = this.props;

        $('#itemToCartModal').modal('show').on('hidden.bs.modal', function (e) {
            removeItemSelected()
        });

        this.setState({
            item: {...this.props.item, count: 1},
        })
    }

    render() {
        const {item, addToCart} = this.props;
        console.log(item);
        const count = this.state.item ? this.state.item.count : 0;
        return (
            <div className="modal fade" id="itemToCartModal" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="itemToCartModalLabel">Ajouter au panier</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table
                                className="table table-hover shopping-cart-wrap table-responsive-md table-responsive-lg table-responsive-sm">
                                <thead className="text-muted">
                                <tr>
                                    <th scope="col">Produit</th>
                                    <th scope="col" width="200">Quantité</th>
                                    <th scope="col" width="120">Prix</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <figure className="media">
                                            <div className="img-wrap"><img src={item.image1 ? item.image1 : item.image}
                                                                           className="img-thumbnail img-sm"
                                                                           alt="product-img"/></div>
                                            <figcaption className="media-body">
                                                <h6 className="title text-truncate text-uppercase">{item.name}</h6>
                                                <dl className="dlist-inline small">
                                                    <dt>Réduction :</dt>
                                                    {" "}
                                                    <dd>{item.reduction > 0 ? `${item.reduction} %` : " Aucune"}</dd>
                                                </dl>
                                                {
                                                    item.promotion && (
                                                        <dl className="dlist-inline small">
                                                            <dt>Prix réel :</dt>
                                                            {" "}
                                                            <dd>{item.price} FCFA</dd>
                                                        </dl>
                                                    )
                                                }
                                                <dl className="dlist-inline small">
                                                    <dt>Nouveau :</dt>
                                                    {" "}
                                                    <dd> Oui</dd>
                                                </dl>
                                            </figcaption>
                                        </figure>
                                    </td>
                                    <td>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <button
                                                    className={`btn btn-secondary 
                                                            ${count === 1 && 'disabled'}`}
                                                    type="button"
                                                    disabled={count === 1}
                                                    onClick={
                                                        (e) =>
                                                            this.setState({
                                                                item: {
                                                                    ...this.state.item,
                                                                    count: count - 1
                                                                }
                                                            })
                                                    }
                                                >
                                                    -
                                                </button>
                                            </div>
                                            <input className="form-control" type="text"
                                                   value={count}
                                                   style={{maxWidth: "40px", width: "40px"}}
                                                   readOnly
                                            />
                                            <div className="input-group-append">
                                                <button className={`btn btn-secondary 
                                                            ${count === item.stock && 'disabled'}`}
                                                        type="button"
                                                        disabled={count === item.stock}
                                                        onClick={
                                                            (e) =>
                                                                this.setState({
                                                                    item: {
                                                                        ...this.state.item,
                                                                        count: count + 1
                                                                    }
                                                                })
                                                        }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/*<input className="form-control" type="number"*/}
                                        {/*       value={count}*/}
                                        {/*       min={1}*/}
                                        {/*       max={item.stock} onChange={(e) => {*/}
                                        {/*    this.setState({item: {...this.state.item, count: e.target.value}})*/}
                                        {/*}}/>*/}
                                    </td>
                                    <td>
                                        <div className="price-wrap">
                                            <var className="price">{item.real_price * count} FCFA</var>
                                            <small className="text-muted">({item.real_price} FCFA chacun)</small>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Annuler
                            </button>
                            <button type="button" className="btn btn-success"
                                    onClick={() => {
                                        addToCart(item, count);
                                    }}
                            >Valider
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


const mapStateToProps = state => {
    return {
        item: state.selectedProduct
    }
};


const mapDispatchToProps = dispatch => {
    return {
        addToCart: (item, count) => {
            dispatch(addItemToCart(item, count));
            $('#itemToCartModal').modal('hide')
        },
        removeItemSelected: () => {
            dispatch(selectItemAction(null));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalAddProduct);


