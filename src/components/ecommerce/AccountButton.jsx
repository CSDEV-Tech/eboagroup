import React, {Component} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {
    faUser,
    faSignInAlt,
    faSignOutAlt,
    faUserCircle,
    faHeart,
    faPlus,
    faShoppingBag
} from "@fortawesome/free-solid-svg-icons/index";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {authLogout} from "../../actions";

class AccountButton extends Component {

    static defaultProps = {
        user: {
            token: null,
            first_name: null,
            last_name: null,
            user_id: null,
            contact1: null,
            contact2: null,
        }
    };

    static propTypes = {
        user: PropTypes.shape({
            token: PropTypes.string,
            first_name: PropTypes.string,
            last_name: PropTypes.string,
            user_id: PropTypes.number,
            contact1: PropTypes.string,
            contact2: PropTypes.string,
        }),
        disconnect: PropTypes.func.isRequired
    };


    render() {
        let {user, disconnect} = this.props;
        const isSignedIn = user.token !== null;

        return (
            <React.Fragment>
                <div className="dropdown">
                    <button className="btn btn-light dropdown-toggle"
                            title={isSignedIn ? (`${user.first_name} ${user.last_name}`) : ("Non connecté")}
                            data-toggle="dropdown" id="accountDropdownButton">
                        <FontAwesomeIcon icon={faUser} className="text-dark"/>

                        {isSignedIn ?
                            (<span className={"badge badge-success"}>{user.first_name[0]}</span>) :
                            (<span className={"badge badge-secondary"}> </span>)
                        }
                    </button>

                    < div className="dropdown-menu dropdown-menu-right" aria-labelledby="accountDropdownButton">
                        {!isSignedIn ? (
                            <React.Fragment>
                                <Link to="/login" className="dropdown-item">
                                    <FontAwesomeIcon icon={faSignInAlt}/>
                                    &nbsp;Se connecter
                                </Link>
                                <Link to="/signup" className="dropdown-item">
                                    <FontAwesomeIcon icon={faPlus}/>
                                    &nbsp;Créer un compte
                                </Link>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Link to="/account" className="dropdown-item">
                                    <FontAwesomeIcon icon={faUserCircle}/>
                                    &nbsp; Mon compte
                                </Link>
                                <Link to="/account/wishlist" className="dropdown-item">
                                    <FontAwesomeIcon icon={faHeart}/>
                                    &nbsp; Ma liste de souhaits
                                </Link>
                                <Link to="/account/commands" className="dropdown-item">
                                    <FontAwesomeIcon icon={faShoppingBag}/>
                                    &nbsp; Mes commandes
                                </Link>

                                <button className="dropdown-item" onClick={disconnect}>
                                    <FontAwesomeIcon icon={faSignOutAlt}/>
                                    &nbsp; Se déconnecter
                                </button>
                            </React.Fragment>
                        )}
                    </div>

                </div>
            </React.Fragment>
        );
    };

}

const mapStateToProps = (state) => {
    return {
        user: state.account,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        disconnect: () => {
            dispatch(authLogout());
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountButton);



