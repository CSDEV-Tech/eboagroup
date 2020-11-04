import React, {Component} from "react";
import logo from "../../PNG LOGO GRIS.png";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {deleteFlashAction, sendFeedBackAction} from "../../actions/common";
import {Link} from "react-router-dom";
import _ from "lodash";
import InputMask from "react-input-mask";
import {checkout} from "../../actions";

class CheckoutPage extends Component {
    static propTypes = {
        sendError: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        validate: PropTypes.func.isRequired,
        deleteFlash: PropTypes.func.isRequired,
        validated: PropTypes.bool,
        success: PropTypes.bool,
        isSignedIn: PropTypes.bool,
        command_code: PropTypes.string,
        msg: PropTypes.string,
        history: PropTypes.object.isRequired,
        account: PropTypes.object.isRequired,
        cart: PropTypes.object,
        towns: PropTypes.arrayOf(PropTypes.object),
        communes: PropTypes.arrayOf(PropTypes.object),
    };

    componentDidMount() {
        const {history, isSignedIn, sendError} = this.props;
        if (!isSignedIn) {
            sendError();
            history.push("/login");
        }

        document.title = `BoaGroUp' - Formulaire de commande`
    }


    state = {
        first_name: "",
        last_name: "",
        town: "",
        commune: "",
        address: "",
        contact: "",
        same: false,
        // save: false,
        payment_type: 1,
        details: "",
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const {validate} = this.props;
        validate(this.state);
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value.trimStart();
        const name = target.name;
        const {account} = this.props;

        if (name === "same" && value === true) {
            this.setState({
                first_name: account.first_name,
                last_name: account.last_name,
                contact: account.contact1,
                town: account.default_town,
                address: account.default_address,
                commune: account.default_commune,
            })
        }

        this.setState({
            [name]: value
        });
    };


    render() {
        const {cart, validated, command_code, success, msg, deleteFlash, isLoading, towns, communes: allCummunes} = this.props;
        let cost = 0;


        let communes = _.filter(allCummunes, com => com.town === this.state.town);
        if (communes) {
            let com = _.find(communes, com => com.name === this.state.commune);
            if (com) cost = com.shipping_cost;
        }

        if (cost === null || cost === undefined) {
            cost = 0;
        }

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

        return (
            <React.Fragment>
                <div className="container">
                    <div className="py-5 text-center">
                        <Link to={"/"} title={"Retour à l'accueil"}>
                            <img className="d-block mx-auto mb-4" src={logo} alt="logo"
                                 width="72" height="72"/>
                        </Link>
                        <h2>Formulaire de commande.</h2>
                        <p className="lead">Veuillez saisir toutes les informations.
                            Les Frais de livraison peuvent varier en fonction de la commune de destination.</p>
                    </div>

                    <div className="row">
                        {validated ? (
                            <React.Fragment>
                                <div className="col-lg-6 col-md-9 offset-lg-3 order-md-1">
                                    {msg && (
                                        <div
                                            className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                            {msg} <br/>
                                            <button type="button" className="close" aria-label="Close"
                                                    onClick={deleteFlash}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    )}
                                    <h4 className="mb-3 text-center">Code de livraison</h4>

                                    <div className="text-center">
                                        <input type="text" className="form-control mb-2" id="code"
                                               required
                                               name={"last_name"}
                                               disabled={true}
                                               value={command_code}
                                        />
                                        <p className={"lead"}>
                                            Voici le code généré pour la commande, c'est celui-ci que vous
                                            allez renseigner lors de la réception du colis.
                                        </p>
                                    </div>
                                    <Link to={"/account/commands"} className={"btn btn-primary btn-block btn-lg"}>
                                        Voir toutes les commandes
                                    </Link>
                                </div>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {/*Cart items*/}
                                <div className="col-md-3 order-md-2 mb-4">
                                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted">Votre panier</span>
                                        <span className="badge badge-secondary badge-pill">{_.size(items)}</span>
                                    </h4>
                                    <ul className="list-group mb-3">
                                        {
                                            _.map(items, (item) => (
                                                item.type === "article" ? (
                                                    <li key={item.article_related.id}
                                                        className="list-group-item d-flex justify-content-between lh-condensed">
                                                        <div>
                                                            <h6 className="my-0">{_.truncate(item.article_related.name, {length: 15})}</h6>
                                                        </div>
                                                        <span
                                                            className="text-muted">{item.article_related.real_price * item.article_count} FCFA</span>
                                                    </li>
                                                ) : (
                                                    <li key={item.id}
                                                        className="list-group-item d-flex justify-content-between lh-condensed">
                                                        <div>
                                                            <h6 className="my-0">{item.label}</h6>
                                                        </div>
                                                        <span
                                                            className="text-muted">{item.total} FCFA</span>
                                                    </li>
                                                )
                                            ))
                                        }

                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total Net : </span>
                                            <strong>{totalPrice} FCFA</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Frais de livraison : </span>
                                            <strong>{cost} FCFA</strong>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between">
                                            <span>Total : </span>
                                            <strong>{totalPrice + cost} FCFA</strong>
                                        </li>
                                    </ul>
                                </div>

                                <div className="col-lg-6 col-md-9 offset-lg-3 order-md-1">
                                    {msg && (
                                        <div
                                            className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                            {msg} <br/>
                                            <button type="button" className="close" aria-label="Close"
                                                    onClick={deleteFlash}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    )}

                                    <h4 className="mb-3">Adresse de facturation</h4>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="same-address"
                                                   name={"same"}
                                                   onChange={this.handleInputChange}
                                                   checked={this.state.same}
                                            />
                                            <label className="custom-control-label" htmlFor="same-address">
                                                Utiliser mes informations</label>
                                        </div>

                                        <hr className="mb-4"/>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="firstName">Nom du bénéficiaire</label>
                                                <input type="text" className="form-control" id="firstName"
                                                       disabled={this.state.same}
                                                       placeholder=""
                                                       required
                                                       name={"last_name"}
                                                       onChange={this.handleInputChange}
                                                       value={this.state.last_name}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="lastName">Prénom(s) du bénéficiaire</label>
                                                <input type="text" className="form-control" id="lastName" placeholder=""
                                                       required
                                                       disabled={this.state.same}
                                                       name={"first_name"}
                                                       onChange={this.handleInputChange}
                                                       value={this.state.first_name}
                                                />
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="state">Ville de livraison</label>
                                                <select className="custom-select d-block w-100" id="state" required
                                                        name={"town"}
                                                        onChange={this.handleInputChange}
                                                        disabled={this.state.same}
                                                        value={this.state.town}
                                                >
                                                    <option value={null}>Choisir une ville...</option>

                                                    {_.map(towns, (item, index) => (
                                                        <option key={index} value={item.name}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="commune">Commune de livraison</label>
                                                <select className="custom-select d-block w-100" id="commune" required
                                                        name={"commune"}
                                                        onChange={this.handleInputChange}
                                                        disabled={this.state.same}
                                                        value={this.state.commune}
                                                >
                                                    <option value={null}>Choisir une commune...</option>

                                                    {_.map(communes, (item, index) => (
                                                        <option key={index} value={item.name}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="contact">Contact du bénéficiaire</label>
                                                <InputMask mask="+225\ 99 99 99 99" maskChar=" " type="text"
                                                           id="inputContact1"
                                                           className="form-control"
                                                           name={"contact"}
                                                           onChange={this.handleInputChange}
                                                           value={this.state.contact}
                                                           disabled={this.state.same}
                                                           required/>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="address">Addresse de livraison</label>
                                            <input type="text"
                                                   className="form-control"
                                                   id="address"
                                                   placeholder="Code postal, Rue, Quartier"
                                                   required
                                                   name={"address"}
                                                   disabled={this.state.same}
                                                   onChange={this.handleInputChange}
                                                   value={this.state.address}
                                            />
                                        </div>

                                        <hr className="mb-4"/>
                                        <h4 className="mb-3">Plus</h4>

                                        <div className="d-block my-3">
                                            <label htmlFor="details">Préciser d'autres informations pour la
                                                commande</label>
                                            <textarea name="details" id="details" cols="30" rows="5"
                                                      className="form-control"
                                                      onChange={this.handleInputChange}
                                                      value={this.state.details}
                                                      placeholder={"je voudrais ajouter ceci..."}/>
                                        </div>


                                        <hr className="mb-4"/>
                                        <h4 className="mb-3">Règlement</h4>

                                        <div className="d-block my-3">
                                            <div className="custom-control custom-radio">
                                                <input id="credit" type="radio"
                                                       className="custom-control-input"
                                                       required
                                                       checked={this.state.payment_type === 1}
                                                       name={"payment_type"}
                                                       onChange={() => {
                                                           this.setState({payment_type: 1})
                                                       }}/>
                                                <label className="custom-control-label" htmlFor="credit">A la
                                                    livraison</label>
                                            </div>
                                            <div className="custom-control custom-radio">
                                                <input id="debit" type="radio"
                                                       className="custom-control-input"
                                                       required
                                                       checked={this.state.payment_type === 2}
                                                       name={"payment_type"}
                                                       onChange={() => {
                                                           this.setState({payment_type: 2})
                                                       }}
                                                />
                                                <label className="custom-control-label" htmlFor="debit">Par Mobile
                                                    Money
                                                </label>
                                            </div>
                                            {this.state.payment_type === 2 && (
                                                <>
                                                    <div>
                                                        MOOV MONEY : <a
                                                        href={"tel:+22502332979"}
                                                        target={"_blank"}>{"(+225) 02-33-29-79"}</a>
                                                    </div>
                                                    <div>
                                                        ORANGE MONEY : <a
                                                        href={"tel:+22559754531"}
                                                        target={"_blank"}>{"(+225) 59-75-45-31"}</a>
                                                    </div>
                                                </>
                                            )}
                                        </div>


                                        <hr className="mb-4"/>
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <Link
                                                    className={`btn btn-outline-secondary btn-lg ${isLoading && "disabled"}`}
                                                    to={"/cart"}>
                                                    Retour au panier
                                                </Link>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <button className={`btn btn-primary btn-lg ${isLoading && "disabled"}`}
                                                        type="submit"
                                                        disabled={isLoading}>
                                                    {isLoading ? (
                                                        <React.Fragment>
                                                            Soumission...
                                                            <div className="spinner-grow text-light" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </React.Fragment>
                                                    ) : "Valider la commande"}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </React.Fragment>
                        )}
                    </div>

                    <footer className="my-5 pt-5 text-muted text-center text-small">
                        <p className="mb-1">&copy;  <a href="#">CSDEV</a> 2019</p>
                    </footer>
                </div>
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoading: state.loading,
        isSignedIn: !!state.account.token,
        history: ownProps.history,
        cart: state.cart,
        account: state.account,
        validated: state.validated,
        command_code: state.last_code,
        msg: state.feedback.msg,
        success: state.feedback.success,
        towns: state.towns,
        communes: state.communes,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        sendError: () => {
            dispatch(sendFeedBackAction(false, "Connectez-vous pour finaliser votre commande"))
        },
        validate: (infos) => dispatch(checkout(infos)),
        deleteFlash: () => dispatch(deleteFlashAction()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage);


