// import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faShoppingBag, faShoppingCart, faStar} from "@fortawesome/free-solid-svg-icons";
import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import {addItemToCart, addItemToWishList, rateProduct} from "../../actions";
import $ from 'jquery';
import {Link} from "react-router-dom";
import {SideBySideMagnifier} from 'react-image-magnifiers';

class ProductDetailShow extends Component {
    static propTypes = {
        product: PropTypes.object.isRequired,
        addToWishList: PropTypes.func.isRequired,
        addToCart: PropTypes.func.isRequired,
        rateProduct: PropTypes.func.isRequired,
        isSignedIn: PropTypes.bool.isRequired,
    };

    toggleSpoiler = () => {
        $("#p-desc").slideToggle();
        $("#spoiler").slideToggle((e) => {
            if ($("#spoiler").hasClass("show")) {
                $("#spoiler-alert").text("afficher la suite");
                $("#spoiler").removeClass("show");
            } else {
                $("#spoiler-alert").text("cacher");
                $("#spoiler").addClass("show");
            }
        });
    };


    state = {
        selectedImage: null,
        count: 1,
        rate_width: 0,
    };

    componentDidMount(prevProps) {
        const {product} = this.props;


        if (product) {
            this.setState({selectedImage: product.image});
        }


        $('#ratingModal').on('hidden.bs.modal', (e) => {
            this.setState({rate_width: 0});
        })
    }

    changeImage = (image) => {
        this.setState({selectedImage: image});
    };

    rate = () => {
        const {rateProduct, product, isSignedIn} = this.props;
        const {rate_width} = this.state;
        let note = (rate_width / 100) * 5;
        isSignedIn && (rateProduct(product, note));
    };

    render() {
        const {addToCart, addToWishList, product, isSignedIn} = this.props;
        const {selectedImage, count, rate_width} = this.state;
        let width = 0;

        if (product) {
            product.extrait = _.truncate(product.description, {length: 80});
            let findee = _.find(product.images, (img) => img === selectedImage);

            if (!findee) {
                this.setState({selectedImage: product.image});
            }
            width = (product.evaluation * 100) / 5;
        }

        return (
            <>
                {
                    product ? (
                            <div className="card mb-5">
                                <div className="row no-gutters">
                                    <aside className="col-sm-5 border-right"
                                           style={{
                                               display: "flex",
                                               flexDirection: "column",
                                               alignItems: "center",
                                               margin: "auto",
                                           }}>
                                        <article className="gallery-wrap">
                                            <div className="img-big-wrap">
                                                <div>
                                                    <a href={selectedImage} data-fancybox="">
                                                        {selectedImage && (
                                                            <div className={"magnifier"}>
                                                                <SideBySideMagnifier
                                                                    className="input-position"
                                                                    imageSrc={selectedImage}
                                                                    largeImageSrc={selectedImage}
                                                                    alwaysInPlace={false}
                                                                    overlayOpacity={.6}
                                                                    overlayBoxOpacity={1}
                                                                    transitionSpeed={.1}
                                                                />
                                                            </div>

                                                        )}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="img-small-wrap">
                                                {_.map(_.filter(product.images, image => image !== selectedImage), (image) => (
                                                    image != null && (
                                                        <div key={product.images.indexOf(image)} className="item-gallery"
                                                        >
                                                            <img
                                                                src={image}
                                                                alt="other"
                                                                onClick={() => {
                                                                    this.changeImage(image)
                                                                }}
                                                                style={{
                                                                    margin: "auto",
                                                                    height: "100%",
                                                                }}/>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </article>
                                    </aside>

                                    <aside className="col-sm-7">
                                        <article className="p-5">
                                            <h3 className="title mb-3">{product.name}
                                            <br/>
                                            {product.reduction > 0 && (<span className="badge badge-warning">-{product.reduction} % </span>)}
                                            &nbsp;
                                            {product.is_new && (<span className="badge badge-danger">Nouveau</span>)}
                                            </h3>

                                            <div className="rating-wrap my-3">
                                                <ul className="rating-stars" style={{
                                                    color: "#c0c0c0",
                                                }}>
                                                    <li style={{width: `${width}%`}} className="stars-active text-warning">
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
                                                <small
                                                    className="label-rating text-muted">&nbsp;&nbsp;{product.reviews_count} avis
                                                </small>
                                                <small className="label-rating text-success">
                                                    <FontAwesomeIcon icon={faShoppingBag}/>&nbsp;&nbsp;
                                                    {product.order_number} commande{product.order_number === 1 ? "" : "s"}
                                                </small>

                                                <br/>
                                                {isSignedIn && (
                                                    <button className={"btn-outline-warning btn btn-sm mt-2"}
                                                            data-toggle="modal" data-target="#ratingModal">
                                                        Donner votre avis
                                                    </button>
                                                )}
                                            </div>

                                            {/*RatingModal */}
                                            <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog"
                                                 aria-labelledby="rateModal"
                                                 aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered modal-sm"
                                                     role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="rateModalLabel">Votre
                                                                évaluation</h5>
                                                            <button type="button" className="close" data-dismiss="modal"
                                                                    aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <ul className="rating-stars" style={{
                                                                color: "#c0c0c0",
                                                                fontSize: "25px",
                                                                textAlign: "center",
                                                                margin: "auto"
                                                            }}>
                                                                <li style={{width: `${rate_width}%`}}
                                                                    className="stars-active text-warning">
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 20})}
                                                                        onClick={() => this.setState({rate_width: 20})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 40})}
                                                                        onClick={() => this.setState({rate_width: 40})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 60})}
                                                                        onClick={() => this.setState({rate_width: 60})}>
                                                                            <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 80})}
                                                                        onClick={() => this.setState({rate_width: 80})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 100})}
                                                                        onClick={() => this.setState({rate_width: 100})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                </li>
                                                                <li>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 20})}
                                                                        onClick={() => this.setState({rate_width: 20})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 40})}
                                                                        onClick={() => this.setState({rate_width: 40})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 60})}
                                                                        onClick={() => this.setState({rate_width: 60})}>
                                                                            <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 80})}
                                                                        onClick={() => this.setState({rate_width: 80})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                    <span
                                                                        onMouseOver={() => this.setState({rate_width: 100})}
                                                                        onClick={() => this.setState({rate_width: 100})}>
                                                                        <FontAwesomeIcon icon={faStar}/>
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary"
                                                                    data-dismiss="modal">Annuler
                                                            </button>
                                                            <button type="button" className="btn btn-primary"
                                                                    data-dismiss="modal"
                                                                    onClick={this.rate}>Valider
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*END*/}

                                            <div className="mb-3">
                                                <var className="price h3 text-warning">
                                                    <span className="num">{product.real_price}</span> <span
                                                    className="currency">FCFA</span>
                                                </var>

                                                {product.reduction > 0 && (
                                                    <del className="text-secondary" id="oldPrice">{product.price} FCFA</del>
                                                )}

                                            </div>


                                            <dl>
                                                <dt>Description</dt>
                                                <dd><p id={"p-desc"}>{product.extrait}...</p>
                                                    {product.description.length > 0 && (
                                                        <>
                                                            <Link to={`#`} onClick={this.toggleSpoiler} id={"spoiler-alert"}
                                                                  style={{
                                                                      textDecoration: "underline"
                                                                  }}>afficher la suite</Link>
                                                            <p style={{display: "none"}}
                                                               id={"spoiler"}>{product.description}</p>
                                                        </>
                                                    )}
                                                </dd>
                                            </dl>
                                            <hr/>
                                            {product.stock > 0 ? (
                                                <React.Fragment>
                                                    <div className="form-row">
                                                        <div className="form-group col-md">
                                                            <label><b>Quantité </b> </label>
                                                            <div className="input-group">
                                                                <div className="input-group">
                                                                    <div className="input-group-prepend">
                                                                        <button
                                                                            className={`btn btn-secondary ${count === 1 && 'disabled'}`}
                                                                            style={{
                                                                                zIndex: 0
                                                                            }}
                                                                            type="button"
                                                                            disabled={count === 1}
                                                                            onClick={
                                                                                (e) =>
                                                                                    this.setState({
                                                                                        count: count - 1
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
                                                            ${count === product.stock && 'disabled'}`}
                                                                                style={{
                                                                                    zIndex: 0
                                                                                }}
                                                                                type="button"
                                                                                disabled={count === product.stock}
                                                                                onClick={
                                                                                    (e) =>
                                                                                        this.setState({
                                                                                            count: count + 1
                                                                                        })
                                                                                }
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                    <button className="btn btn-primary mb-1" onClick={() => {
                                                        addToCart(product, count)
                                                    }}>
                                                        <FontAwesomeIcon icon={faShoppingCart}/> J'achète !
                                                    </button>
                                                </React.Fragment>
                                            ) : (
                                                <div className="h4 text-secondary">Stock Epuisé !</div>
                                            )}
                                            {
                                                isSignedIn && (
                                                    <React.Fragment>
                                                        {" "}
                                                        <button className="btn  btn-outline-danger mb-1"
                                                                onClick={() => addToWishList(product)}>
                                                            <FontAwesomeIcon icon={faHeart}/> Peut-être un autre jour
                                                        </button>
                                                    </React.Fragment>
                                                )
                                            }
                                        </article>
                                    </aside>
                                </div>
                            </div>
                        )
                        : <></>
                }
            </>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        product: ownProps.item,
        isSignedIn: !!state.account.token,
        account: state.account,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addToWishList: (item) => {
            dispatch(addItemToWishList(item))
        },
        addToCart: (item, count) => {
            dispatch(addItemToCart(item, count))
        },
        //  TODO
        rateProduct: (product, note) => {
            // console.log(product, note );
            dispatch(rateProduct(product, note));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailShow);
