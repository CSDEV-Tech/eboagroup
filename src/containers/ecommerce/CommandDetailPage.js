import React, {Component} from "react";
import {Link} from "react-router-dom";
import _ from "lodash";
import {connect} from "react-redux";
import {getCommands} from "../../actions";
import PropTypes from "prop-types";

class CommandDetailPage extends Component {
    static propTypes = {
        getCommands: PropTypes.func.isRequired,
        command_list: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    componentDidMount() {
        const {getCommands, command_list} = this.props;

        if (command_list.length === 0) {
            getCommands();
        }

        document.title = `BoaGroUp' - Détail de la commande`;
    }

    months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    render() {
        const {match, command_list} = this.props;
        const ref = match.params.ref;
        const command = _.find(command_list, item => item.ref === ref);

        const {commandline_set, promotions} = command;

        let items = [];
        _.forEach(commandline_set, item => {
            item.type = "article";
            items = [...items, item];
        });

        _.forEach(promotions, item => {
            item.type = "promotion";
            items = [...items, item];
        });

        console.log(items);

        return (
            <div className="starter-template mb-5 mt-5 container">
                <nav aria-label="breadcrumb" className="w-100">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">Accueil</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/account">Compte</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/account/commands">Commandes</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Détail de la commande <b>{ref}</b>
                        </li>
                    </ol>
                </nav>
                <h2>Détails de la commande</h2>
                <div className="card mb-4 p-3">
                    {" "}
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 col-5">
                            <div>
                                <b>Etat: </b>
                            </div>
                        </div>
                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>
                                {" "}
                                {!command.delivered ? (
                                    <span className="text-warning">En cours de livraison</span>
                                ) : (
                                    <span className="text-success">Livré</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 col-5">
                            <div>
                                <b>Coût Net : </b>
                            </div>
                        </div>

                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>{command.total_cost - command.shipping_cost} FCFA</div>
                        </div>

                        <div className="col-md-3 col-5">
                            <div>
                                <b>Frais de livraison : </b>
                            </div>
                        </div>

                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>{command.shipping_cost} FCFA</div>
                        </div>

                        <div className="col-md-3 col-5">
                            <div>
                                <b>Coût total : </b>
                            </div>
                        </div>

                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>{command.total_cost} FCFA</div>
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 col-5">
                            <div>
                                <b>Noms et prénoms du bénéficiaire: </b>
                            </div>
                        </div>
                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>
                                {command.last_name} {command.first_name}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 col-5">
                            {" "}
                            <div>
                                <b>Contact du bénéficiaire: </b>
                            </div>
                        </div>
                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>{command.contact}</div>
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 col-5">
                            {" "}
                            <div>
                                <b>Addresse de livraison: </b>
                            </div>
                        </div>
                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>
                                {command.address.town}, {command.address.municipality},{" "}
                                {command.address.address}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2 align-items-center">
                        <div className="col-md-3 col-5">
                            {" "}
                            <div>
                                <b>Date d'émission: </b>
                            </div>
                        </div>
                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            {" "}
                            <div>
                                {" "}
                                {command.date_emission.day}{" "}
                                {this.months[command.date_emission.month - 1]}{" "}
                                {command.date_emission.year}
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-3 col-5">
                            <div>
                                <b>Date de réception: </b>
                            </div>
                        </div>
                        <div className="col-md-9 col-5 d-flex flex-row align-items-center">
                            <div>
                                {command.date_reception.day}{" "}
                                {this.months[command.date_reception.month - 1]}{" "}
                                {command.date_reception.year}
                            </div>
                        </div>
                    </div>
                </div>

                <h2>Liste d'articles de la commande</h2>
                <div className="card mb-4">
                    {_.size(items) === 0 ? (
                        // Empty
                        <div className="text-center d-table" style={{height: "400px"}}>
                            <div className="d-table-cell align-middle">
                                <div id="empty-icon" className="text-secondary">
                                    <div className="spinner-grow text-secondary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                <div id="empty-text" style={{fontSize: "30px"}}>
                                    <b className="text-secondary">Chargement de la commande...</b>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Not Empty
                        <table
                            className="table table-hover shopping-cart-wrap table-responsive-md table-responsive-lg table-responsive-sm">
                            <thead className="text-muted">
                            <tr>
                                <th scope="col">Produit</th>
                                <th scope="col">Quantité</th>
                                <th scope="col">Prix</th>
                            </tr>
                            </thead>
                            <tbody>
                            {_.map(items, (item, index) =>
                                item.type === "article" ? (
                                    <tr key={index}>
                                        <td>
                                            <figure className="media">
                                                <div className="img-wrap">
                                                    <Link to={`/p/${item.article_related.slug}`}>
                                                        <img
                                                            src={item.article_related.image1}
                                                            className="img-thumbnail img-sm"
                                                            alt="product-img"
                                                        />
                                                    </Link>
                                                </div>
                                                <figcaption className="media-body">
                                                    <Link to={`/p/${item.article_related.slug}`}>
                                                        <h6 className="title text-truncate text-uppercase text-dark">
                                                            {item.article_related.name}
                                                        </h6>
                                                    </Link>
                                                    <dl className="dlist-inline">
                                                        <dd>
                                                            {item.article_related.reduction > 0 && (
                                                                <div className="badge badge-danger">
                                                                    {" "}
                                                                    {item.article_related.reduction} % de
                                                                    réduction
                                                                </div>
                                                            )}
                                                        </dd>
                                                    </dl>
                                                    <dl className="dlist-inline">
                                                        {item.article_related.is_new === "Oui" && (
                                                            <span className="badge badge-warning">
                                  Nouveau
                                </span>
                                                        )}
                                                    </dl>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={item.article_count}
                                                readOnly
                                                style={{maxWidth: "40px", width: "40px"}}
                                            />
                                        </td>
                                        <td>
                                            <div className="price-wrap">
                                                <var className="price">
                                                    {item.article_related.real_price *
                                                    item.article_count}{" "}
                                                    FCFA
                                                </var>
                                                <small className="text-muted">
                                                    ({item.article_related.real_price} FCFA chacun)
                                                </small>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={index}>
                                        <td>
                                            <figure className="media">
                                                <div className="img-wrap">
                                                    <Link to={`/sales/${item.slug}`}>
                                                        <img
                                                            src={item.image}
                                                            className="img-thumbnail img-sm"
                                                            alt="product-img"
                                                        />
                                                    </Link>
                                                </div>
                                                <figcaption className="media-body">
                                                    <Link to={`/Sales/${item.slug}`}>
                                                        <h6 className="title text-truncate text-uppercase text-dark">
                                                            {item.label}
                                                        </h6>
                                                    </Link>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={1}
                                                readOnly
                                                style={{maxWidth: "40px", width: "40px"}}
                                            />
                                        </td>
                                        <td>
                                            <div className="price-wrap">
                                                <var className="price">{item.total} FCFA</var>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        command_list: state.commands.items,
        match: ownProps.match
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCommands: () => dispatch(getCommands())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommandDetailPage);
