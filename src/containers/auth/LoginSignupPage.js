import React, {Component} from "react";
import logo from "../../PNG LOGO GRIS.png";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import { authLogin, authRegister, authChangePassword, authResetPasswordRequest, authResetPassword, authEmailConfirm} from "../../actions";
import {sendFeedBackAction, deleteFlashAction} from "../../actions/common";
import InputMask from 'react-input-mask';
import _ from "lodash";
// import $ from "jquery";

class LoginSignupPage extends Component {

    state = {
        first_name: "",
        last_name: "",
        email: "",
        contact1: "",
        contact2: "",
        town: "",
        address: "",
        commune: "",
        password1: "",
        password2: "",
    };

    loginInfos = {
        email: "",
        password: "",
    };

    passwordChangeInfos = {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
    };

    static propTypes = {
        action: PropTypes.oneOf([
            "forgotPassword",
            "login",
            "signup",
            "changePassword",
            "passwordReset",
            "confirmEmail"
        ]).isRequired,
        loading: PropTypes.bool,
        login: PropTypes.func.isRequired,
        msg: PropTypes.string,
        success: PropTypes.bool,
        deleteFlash: PropTypes.func.isRequired,
        sendFeedBack: PropTypes.func.isRequired,
        signup: PropTypes.func.isRequired,
        changePassword: PropTypes.func.isRequired,
        sendForgetRequest: PropTypes.func.isRequired,
        resetPassword: PropTypes.func.isRequired,
        confirmEmail: PropTypes.func.isRequired,
        signupInfos: PropTypes.object.isRequired,
        isSignedIn: PropTypes.bool,
        history: PropTypes.object,
        email_verified: PropTypes.bool,
        communes: PropTypes.arrayOf(PropTypes.object).isRequired,
        towns: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    handleSubmit = (e) => {
        const { login, action, signup, changePassword, sendForgetRequest, resetPassword, match} = this.props;
        e.preventDefault();

        switch (action) {
            case "login":
                login(this.loginInfos.email, this.loginInfos.password);
                break;
            case "signup":
                signup(this.state);
                break;
            case "forgotPassword":
                sendForgetRequest(this.loginInfos.email);
                break;
            case "changePassword":
                changePassword(this.passwordChangeInfos);
                break;
            case "passwordReset":
                resetPassword(match.params.token, this.passwordChangeInfos.newPassword, this.passwordChangeInfos.newPasswordConfirm);
                break;
            default:
                break;
        }
    };

    componentDidMount() {
        const { history, isSignedIn, sendError, signupInfos, match, confirmEmail} = this.props;

        console.log(match);
        this.setState({...signupInfos});

        const {action} = this.props;

        switch (action) {
            case "login":
                document.title = `BoaGroUp' - Connexion`;
                break;
            case "signup":
                document.title = `BoaGroUp' - Création de compte`;
                break;
            case "forgotPassword":
                // if (!isSignedIn) {
                //     sendError();
                //     history.push("/login");
                //     return;
                // }
                document.title = `BoaGroUp' - Mot de passe oublié`;
                break;
            case "changePassword":
                if (!isSignedIn) {
                    sendError();
                    history.push("/login");
                    return;
                }
                document.title = `BoaGroUp' - Changer le mot de passe `;
                break;
            case "confirmEmail":
                confirmEmail(match.params.token);
                document.title = `BoaGroUp' - Activation du compte `;
                break;
            case "passwordReset":
                document.title = `BoaGroUp' - Réinitialiser le mot de passe `;
                break;
            default:
                document.title = `BoaGroUp' - Connexion`;
                break;
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // if (name === "town" && (value === "Abengourou" || value === "Bouaké")) {
        //     this.setState({
        //         "address": "CTE Gare"
        //     });

        //     $("[name='address']").addClass("disabled").attr("disabled", 'disabled');
        // } else {
        //     $("[name='address']").removeClass("disabled").attr("disabled", false);
        // }

        this.setState({
            [name]: value.trimStart()
        });
    };


    render() {
        const { loading, action, success, msg, deleteFlash, email_verified, towns, communes: allCommunes} = this.props;

        // const towns = [
        //     "Yamoussoukro",
        //     "Abidjan",
        // ];
        const communes = _.filter(
            allCommunes,
            com => com.town === this.state.town
        );

        return (
            <div className="text-center h-100 bg-light body">
                <form className="form-signin" onSubmit={this.handleSubmit}>
                    <Link to="/" title={"Retour à l'accueil"}>
                        <img className="mb-4" src={logo} alt="" width="100" height="100"/>
                    </Link>
                    {action === "login" ? (
                        <React.Fragment>
                            <h1 className="h3 mb-3 font-weight-normal">Se connecter</h1>


                            {
                                msg && email_verified === false ? (
                                    <>
                                        <div
                                            className={`alert alert-warning alert-dismissible`}>
                                            Votre compte n'est pas encore activé <br/>
                                            {success && (<Link to="/account/user-info">Voir votre profil</Link>)}
                                            <button type="button" className="close" aria-label="Close"
                                                    onClick={deleteFlash}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    msg && (
                                        <div
                                            className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                            {msg} <br/>
                                            {success && (<Link to="/">Retour à l'accueil</Link>)}
                                            <button type="button" className="close" aria-label="Close"
                                                    onClick={deleteFlash}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                    )
                                )
                            }


                            <label htmlFor="inputEmail" className="sr-only">adresse Email </label>
                            <input type="email" id="inputEmail" className="form-control mb-2"
                                   placeholder="adresse Email"
                                   required autoFocus onChange={(e) => {
                                this.loginInfos.email = e.target.value.trimStart()
                            }}
                            />
                            <label htmlFor="inputPassword" className="sr-only">Mot de passe</label>
                            <input type="password" id="inputPassword" className="form-control mb-2"
                                   placeholder="Mot de passe"
                                   required="" onChange={(e) => {
                                this.loginInfos.password = e.target.value.trimStart()
                            }}
                            />
                            <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                                    disabled={loading}>
                                {loading ? (
                                    <React.Fragment>
                                        Soumission...
                                        <div className="spinner-grow text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </React.Fragment>
                                ) : "Connexion"}
                            </button>
                            <div>
                                Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
                            </div>
                            <div>
                                <Link to="/forgot-password">Mot de passe oublié ?</Link>
                            </div>
                        </React.Fragment>
                    ) : action === "signup" ?
                        (
                            <React.Fragment>
                                <h1 className="h3 mb-3 font-weight-normal">Créer un compte</h1>
                                {msg && (
                                    <div
                                        className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                        {msg} <br/>
                                        {success && (<Link to="/login">Connectez-vous</Link>)}
                                        <button type="button" className="close" aria-label="Close"
                                                onClick={deleteFlash}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                )}

                                <input type="text" id="inputFirstName" className="form-control mb-2"
                                       placeholder="Nom"
                                       required autoFocus
                                       name={"last_name"}
                                       onChange={this.handleInputChange}
                                       value={this.state.last_name}
                                />

                                <input type="text" id="inputLastName" className="form-control mb-2"
                                       placeholder="Prénom"
                                       name={"first_name"}
                                       onChange={this.handleInputChange}
                                       value={this.state.first_name}
                                       required/>

                                <input type="email" id="inputEmail" className="form-control mb-2"
                                       placeholder="adresse Email"
                                       name={"email"}
                                       onChange={this.handleInputChange}
                                       value={this.state.email}
                                       required/>

                                <div className="form-row mb-2">
                                    <div className="col">
                                        <InputMask mask="+225\ 99 99 99 99" maskChar=" " type="text" id="inputContact1"
                                                   className="form-control"
                                                   placeholder="Contact 1"
                                                   name={"contact1"}
                                                   onChange={this.handleInputChange}
                                                   value={this.state.contact1}
                                                   required/>
                                    </div>
                                    <div className="col">
                                        <InputMask mask="+225\ 99 99 99 99" maskChar=" " type="text" id="inputContact2"
                                                   className="form-control "
                                                   placeholder="Contact 2"
                                                   name={"contact2"}
                                                   onChange={this.handleInputChange}
                                                   value={this.state.contact2}
                                        />

                                    </div>

                                </div>

                                <select id="inputTown" className="form-control mb-2"
                                        placeholder="Ville de résidence" required
                                        name={"town"}
                                        onChange={this.handleInputChange}
                                        value={this.state.town}
                                >
                                    <option value={""}>Choisir une ville...</option>

                                    {_.map(towns, (item, index) => (
                                        <option key={index} value={item.name}>{item.name}</option>
                                    ))}
                                </select>

                                    <select id="inputCommune" className="form-control mb-2"
                                        placeholder="Ville de résidence" required
                                        name={"commune"}
                                        onChange={this.handleInputChange}
                                        value={this.state.commune}
                                    >
                                        <option value={""}>Choisir une commune...</option>

                                        {_.map(communes, (item, index) => (
                                            <option key={index} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>



                                <input type="text" id="inputAddress" className="form-control mb-2"
                                       placeholder="Adresse de livraison par défaut" required
                                       name={"address"}
                                       onChange={this.handleInputChange}
                                       value={this.state.address}
                                />
                                <label htmlFor="inputPassword" className="sr-only">Créer Mot de passe </label>
                                <input type="password" id="inputPassword1" className="form-control mb-2"
                                       placeholder="Créer un Mot de passe"
                                       name={"password1"}
                                       onChange={this.handleInputChange}
                                       required/>

                                <label htmlFor="inputPassword" className="sr-only">Confirmer Mot de passe</label>
                                <input type="password" id="inputPassword2" className="form-control mb-2"
                                       placeholder="Confirmer le Mot de passe"
                                       name={"password2"}
                                       onChange={this.handleInputChange}
                                       required/>
                                <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                                        disabled={loading}>
                                    {loading ? (
                                        <React.Fragment>
                                            Soumission...
                                            <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </React.Fragment>
                                    ) : "Créer le compte"}
                                </button>
                                <div>
                                    Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
                                </div>
                            </React.Fragment>
                        ) : action === "forgotPassword" ? (
                            (
                                <React.Fragment>
                                    <h1 className="h3 mb-3 font-weight-normal">Mot de passe oublié</h1>

                                        {msg && (
                                            <div
                                                className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                                {msg} <br />
                                                <button type="button" className="close" aria-label="Close"
                                                    onClick={deleteFlash}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                        )}


                                    <label htmlFor="inputEmail" className="sr-only">adresse Email </label>
                                    <input type="email" id="inputEmail" className="form-control mb-2"
                                           placeholder="adresse Email"
                                           required autoFocus
                                           onChange={(e) => {
                                               this.loginInfos.email = e.target.value.trimStart()
                                           }}
                                    />
                                    <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                                            disabled={loading}>
                                        {loading ? (
                                            <React.Fragment>
                                                Soumission...
                                                <div className="spinner-grow text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </React.Fragment>
                                        ) : "Recevoir l'email"}
                                    </button>
                                    <div>
                                        Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
                                    </div>
                                </React.Fragment>
                            )
                            ) : action === "changePassword" ? (
                            <>
                                <h1 className="h3 mb-3 font-weight-normal">Changer votre mot de passe</h1>

                                {msg && (
                                    <div
                                        className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                        {msg} <br/>
                                        {success && (<Link to="/">Retour à l'accueil</Link>)}
                                        <button type="button" className="close" aria-label="Close"
                                                onClick={deleteFlash}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                )}

                                <label htmlFor="inputOldPassword" className="sr-only">Ancien Mot de passe</label>
                                <input type="password" id="inputOldPassword" className="form-control mb-2"
                                       placeholder="Ancien Mot de passe"
                                       required autoFocus onChange={(e) => {
                                    this.passwordChangeInfos.oldPassword = e.target.value.trimStart()
                                }}
                                />
                                <label htmlFor="inputNewPassword" className="sr-only">Nouveau Mot de passe</label>
                                <input type="password" id="inputNewPassword" className="form-control mb-2"
                                       placeholder="Nouveau Mot de passe"
                                       required onChange={(e) => {
                                    this.passwordChangeInfos.newPassword = e.target.value.trimStart()
                                }}/>

                                <label htmlFor="inputNewPasswordConfirmation" className="sr-only">Confirmation du Mot de
                                    passe</label>
                                <input type="password" id="inputNewPasswordConfirmation" className="form-control mb-2"
                                       placeholder="Confirmation du Mot de passe"
                                       required="" onChange={(e) => {
                                    this.passwordChangeInfos.newPasswordConfirm = e.target.value.trimStart()
                                }}
                                />
                                <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                                        disabled={loading}>
                                    {loading ? (
                                        <React.Fragment>
                                            Soumission...
                                            <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </React.Fragment>
                                    ) : "Valider"}
                                </button>
                                <div>
                                    <Link to="/account/user-info">Retour au profil</Link>
                                </div>
                            </>
                                ) : action === "passwordReset" ?  (
                            <>
                                            <h1 className="h3 mb-3 font-weight-normal">Réinitialiser votre mot de passe</h1>

                                            {msg && (
                                                <div
                                                    className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                                    {msg} <br />
                                                    {success && (<Link to="/login">Connectez-vous</Link>)}
                                                    <button type="button" className="close" aria-label="Close"
                                                        onClick={deleteFlash}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                            )}

                                            <label htmlFor="inputNewPassword" className="sr-only">Nouveau Mot de passe</label>
                                            <input type="password" id="inputNewPassword" className="form-control mb-2"
                                                placeholder="Nouveau Mot de passe"
                                                required onChange={(e) => {
                                                    this.passwordChangeInfos.newPassword = e.target.value.trimStart()
                                                }} />

                                            <label htmlFor="inputNewPasswordConfirmation" className="sr-only">Confirmation du Mot de
                                    passe</label>
                                            <input type="password" id="inputNewPasswordConfirmation" className="form-control mb-2"
                                                placeholder="Confirmation du Mot de passe"
                                                required onChange={(e) => {
                                                    this.passwordChangeInfos.newPasswordConfirm = e.target.value.trimStart()
                                                }}
                                            />
                                            <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                                                disabled={loading}>
                                                {loading ? (
                                                    <React.Fragment>
                                                        Soumission...
                                            <div className="spinner-grow text-light" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </React.Fragment>
                                                ) : "Valider"}
                                            </button>
                                            <div>
                                                <Link to="/account/user-info">Retour au profil</Link>
                                            </div>

                            </>
                    ) :  (
                            <>

                                                {msg && (
                                                    <div
                                                        className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                                        {msg} <br />
                                                        {success && (<Link to="/login">Connectez-vous</Link>)}
                                                        <button type="button" className="close" aria-label="Close"
                                                            onClick={deleteFlash}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                )}

                            </>
                        )
                }
                    <p className="mt-3 mb-3 text-muted">© <a href="#" target={"_blank"}>CSDEV</a> 2019</p>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loading: state.loading,
        action: ownProps.action,
        msg: state.feedback.msg,
        success: state.feedback.success,
        signupInfos: state.signupInfos,
        isSignedIn: !!state.account.token,
        email_verified: state.account.email_verified,
        history: ownProps.history,
        towns: state.towns,
        communes: state.communes,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(authLogin(email, password)),
        deleteFlash: () => dispatch(deleteFlashAction()),
        sendFeedBack: (success, msg) => dispatch(sendFeedBackAction(success, msg)),
        signup: (infos) => dispatch(authRegister(infos)),
        // TODO
        changePassword: (infos) => dispatch(authChangePassword(infos)),
        // TODO
        sendForgetRequest: (email) => dispatch(authResetPasswordRequest(email)),
        sendError: (msg="Connectez-vous pour finaliser votre commande") => {
            dispatch(sendFeedBackAction(false, msg))
        },
        resetPassword: (token, password1, password2) => dispatch(authResetPassword(token, password1, password2)),//console.log(token, password1, password2),
        confirmEmail: (token) => dispatch(authEmailConfirm(token)), 
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignupPage);
