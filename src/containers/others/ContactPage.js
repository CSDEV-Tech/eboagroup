import React, {Component} from "react";
import logo from "../../PNG LOGO GRIS.png";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {deleteFlashAction} from "../../actions/common";
import InputMask from 'react-input-mask';
import {contact} from "../../actions";

class ContactPage extends Component {

    state = {
        email: "",
        name: "",
        message: "",
        phone: "",
    };

    static propTypes = {
        msg: PropTypes.string,
        sendMessage: PropTypes.func.isRequired,
        deleteFlash: PropTypes.func.isRequired,
        loading: PropTypes.bool,
        success: PropTypes.bool,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {sendMessage} = this.props;
        sendMessage({...this.state});

        this.setState({
            email: "",
            name: "",
            message: "",
            phone: "",
        })
    };

    componentDidMount(): void {
        document.title = "BoaGroUp' - Contact"
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value.trimStart()
        });
    };


    render() {
        const {email, message, name, phone} = this.state;
        const {msg, success, loading, deleteFlash} = this.props;

        return (
            <div className="text-center h-100 bg-light body">
                <form className="form-signin" onSubmit={this.handleSubmit}
                      style={{
                          maxWidth: "500px"
                      }}>
                    <Link to="/" title={"Retour à l'accueil"}>
                        <img className="mb-4" src={logo} alt="" width="100" height="100"/>
                    </Link>
                    <React.Fragment>
                        <h1 className="h4 mb-3 font-weight-normal">
                            Vous avez des questions, des commentaires ou des suggestions ? <br/>
                            Laissez nous un message
                            <span aria-label={"emoji"} role={"img"}> 😊 </span> , nous serons ravis de vous aider.
                        </h1>

                        {msg && (
                            <div
                                className={`alert alert-${success ? "success" : "danger"} alert-dismissible`}>
                                {msg} <br/>
                                {success && (<Link to="/">Retour à l'accueil</Link>)}
                                <button type="button" className="close" aria-label="Close" onClick={deleteFlash}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}

                        <div className="row">
                            <div className="col-md-6">
                                <input type="text" id="inputName" className="form-control mb-2"
                                       placeholder="votre nom *"
                                       name={"name"}
                                       required onChange={this.handleInputChange}
                                       value={name}
                                />

                                <input type="email" id="inputEmail" className="form-control mb-2"
                                       placeholder="votre addresse Email *"
                                       name={"email"}
                                       required autoFocus onChange={this.handleInputChange}
                                       value={email}
                                />

                                <InputMask
                                    mask="+225\ 99 99 99 99" maskChar=" "
                                    type="tel"
                                    id="inputPhone"
                                    className="form-control mb-2"
                                    placeholder="votre n° de téléphone *"
                                    name={"phone"}
                                    required onChange={this.handleInputChange}
                                    value={phone}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputMessage" className="sr-only">Votre Message</label>
                                <textarea id="inputMessage" className="form-control mb-2"
                                          placeholder="Votre Message *"
                                          name={"message"}
                                          rows={5}
                                          required onChange={this.handleInputChange}
                                          value={message}
                                />
                            </div>
                        </div>

                        <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                                disabled={loading}>
                            {loading ? (
                                <React.Fragment>
                                    Soumission...
                                    <div className="spinner-grow text-light" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </React.Fragment>
                            ) : "Envoyer Message"}
                        </button>
                    </React.Fragment>
                    <p className="mt-3 mb-3 text-muted">
                        <Link to="/">Retour à l'accueil</Link> <br/>
                        <Link to="/about">A propos de nous</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to="/terms-and-policy" style={{
                            whiteSpace: "no-wrap"
                        }}>Notre Politique de Livraison</Link>
                    </p>
                    <p className="mt-3 mb-3 text-muted">© <a href="#" target={"_blank"}>CSDEV</a> 2019</p>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loading: state.loading,
        msg: state.feedback.msg,
        success: state.feedback.success,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        sendMessage: ({email, name, phone, message}) => dispatch(contact(name, phone, email, message)),
        deleteFlash: () => dispatch(deleteFlashAction()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);
