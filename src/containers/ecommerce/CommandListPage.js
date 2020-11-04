import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { getCommands, initApp } from "../../actions";
import PropTypes from "prop-types";

class CommandListPage extends Component {
  static propTypes = {
    getCommands: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  componentDidMount() {
    const { getCommands } = this.props;

    getCommands();

    document.title = `BoaGroUp' - Mes commandes`;
  }

  render() {
    const { items } = this.props;
    const months = [
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
            <li className="breadcrumb-item active" aria-current="page">
              Commandes
            </li>
          </ol>
        </nav>

        <h1>Mes commandes</h1>

        <div className="card mb-4">
          {_.size(items) === 0 ? (
            // Empty
            <div className="text-center d-table" style={{ height: "400px" }}>
              <div className="d-table-cell align-middle">
                <div
                  id="empty-icon"
                  className="text-secondary"
                  style={{ fontSize: "100px" }}
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                </div>
                <div id="empty-text" style={{ fontSize: "30px" }}>
                  <b className="text-secondary">
                    Vous n'avez encore passé aucune commande
                  </b>
                </div>
              </div>
            </div>
          ) : (
            // Not Empty
            <table className="table table-hover shopping-cart-wrap table-responsive-md table-responsive-lg table-responsive-sm">
              <thead className="text-muted">
                <tr>
                  <th scope="col">Référence</th>
                  <th scope="col">Destinataire</th>
                  <th scope="col">Date d'émission</th>
                  <th scope="col">Date de réception</th>
                  <th scope="col">Code de livraison</th>
                  <th scope="col">Etat</th>
                </tr>
              </thead>
              <tbody>
                {_.map(items, item => (
                  <tr key={item.ref}>
                    <td>
                      <Link to={`/account/commands/${item.ref}`}>
                        {item.ref}
                      </Link>
                    </td>

                    <td>
                      {item.first_name} {item.last_name}
                    </td>

                    <td style={{}}>
                      {item.date_emission.day}{" "}
                      {months[item.date_emission.month - 1]}{" "}
                      {item.date_emission.year} {item.date_emission.hours}:
                      {`${item.date_emission.minutes}`.length === 1
                        ? `0${item.date_emission.minutes}`
                        : `${item.date_emission.minutes}`}
                    </td>

                    <td>
                      {item.date_reception.day}{" "}
                      {months[item.date_reception.month - 1]}{" "}
                      {item.date_reception.year}{" "}
                      {/*{item.date_reception.hours}:{*/}
                      {/*`${item.date_reception.minutes}`.length === 1 ? (*/}
                      {/*    `0${item.date_reception.minutes}`*/}
                      {/*) : (*/}
                      {/*    `${item.date_reception.minutes}`*/}
                      {/*)}*/}
                    </td>

                    <td>{item.shipping_code}</td>

                    <td>
                      {!item.delivered ? (
                        <span className="text-warning">
                          En cours de livraison
                        </span>
                      ) : (
                        <span className="text-success">Livré</span>
                      )}
                    </td>
                  </tr>
                ))}
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
    items: state.commands.items
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCommands: () => dispatch(getCommands()),
    init: () => dispatch(initApp())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommandListPage);
