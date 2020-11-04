import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import { faPen, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";
import Tooltip from "react-simple-tooltip";
import Swal from "sweetalert2";
import _ from "lodash";
import { editUser, authSendEmailConfirmRequest } from "../../actions";

class UserInfoPage extends Component {
  componentDidMount() {
    document.title = `BoaGroUp' - Profil`;
    const { account } = this.props;
    this.setState({ account });
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    editProfile: PropTypes.func.isRequired,
    sendEmailConfirmRequest: PropTypes.func.isRequired,
    communes: PropTypes.arrayOf(PropTypes.object).isRequired,
    towns: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool
  };

  handleInputChange = e => {
    let { name, value } = e.target;

    console.log(name, value, e.target);

    this.setState({
      account: {
        ...this.state.account,
        [name]: value.trimStart()
      }
    });
  };

  state = {
    account: null,
    avatar: {
      preview: null,
      file: null
    }
  };

  encodeImageFileAsURL = element => {
    var file = element.files[0];

    //console.log(file.size);

    // max file size : 1Mo
    if (file.size <= 1048576) {
      var reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result.toString().indexOf("data:image/") === 0) {
          this.setState({ avatar: { preview: reader.result, file } });
        } else {
          Swal.fire({
            showConfirmButton: true,
            title: "OOPS !",
            text: "Le fichier choisi n'est pas une image",
            type: "error"
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        showConfirmButton: true,
        title: "OOPS !",
        text: "Le fichier choisi est trop grand ! (Maximum : 1 Mo)",
        type: "error"
      });
    }
  };

  previewImageUploaded = e => {
    e.target.files.length > 0 && this.encodeImageFileAsURL(e.target);
  };

  render() {
    let {
      account,
      editProfile,
      towns,
      communes: allCommunes,
      isLoading,
      sendEmailConfirmRequest
    } = this.props;
    const { account: state_account } = this.state;

    // set state account to something if data has been loaded
    let communes = [];
    if (state_account && account.token !== null) {
      if (state_account.token === null) {
        this.setState({ account });
      } else {
        account = { ...account, ...state_account };
      }
    }

    if (account.token) {
      communes = _.filter(
        allCommunes,
        com => com.town === account.default_town
      );
    }


    // console.log(_.find(towns, account.default_town), account.default_town);

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
              Informations personnelles
            </li>
          </ol>
        </nav>

        <h1>Mon profil</h1>

        {account.email_verified === false && (
          <div className="alert alert-warning">
            Votre compte n'a pas encore été activé, veuillez consulter votre
            boîte mail pour l'activer. &nbsp;
            <Link to={"#"} onClick={sendEmailConfirmRequest}>
              Renvoyer le lien d'activation
            </Link>
          </div>
        )}
        <div className="card mb-4">
          <div className="card-body">
            {account.token ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  editProfile({
                    ...state_account,
                    image: this.state.avatar.file
                  });
                }}
              >
                <h5 className={"bg-light p-2"}>Image de profil</h5>

                <div className="pr-3 pl-3">
                  <div className="avatar avatar-outline mt-5 mb-5" id="profile">
                    <div
                      className="avatar-holder d-flex flex-row align-items-center"
                      style={{
                        backgroundImage: `url(${
                          this.state.avatar.preview
                            ? this.state.avatar.preview
                            : account.avatar
                        })`
                      }}
                      onClick={ev => $(".avatar-upload").click()}
                    >
                      {!this.state.avatar.preview || !this.state.avatar && (
                        <div
                          className={"text-primary-dark m-auto"}
                          style={{
                            fontSize: "5rem"
                          }}
                        >
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      )}
                    </div>

                    <label className="avatar-upload" htmlFor={"avatar-img"}>
                      <FontAwesomeIcon icon={faPen} />
                      <input
                        type="file"
                        name="profile_avatar"
                        id={"avatar-img"}
                        accept=".png, .jpg, .jpeg"
                        onChange={this.previewImageUploaded}
                      />
                    </label>

                    {this.state.avatar.preview && (
                      <>
                        <Tooltip
                          content="annuler modification avatar"
                          customCss={`white-space: nowrap;`}
                          className={"avatar-cancel"}
                        >
                          <div
                            className={"avatar-cancel-content"}
                            onClick={e =>
                              this.setState({
                                avatar: {
                                  preview: null,
                                  file: null
                                }
                              })
                            }
                          >
                            <span className={"m-auto"}>
                              <FontAwesomeIcon icon={faTimes} />
                            </span>
                          </div>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>

                <h5 className={"bg-light p-2"}>Personnel</h5>

                <div className="pr-3 pl-3">
                  <div className="form-group row">
                    <label
                      htmlFor="staticLastName"
                      className="col-sm-4 col-form-label"
                    >
                      Nom
                    </label>
                    <div className="col-sm-8">
                      <input
                        required
                        type="text"
                        className="form-control"
                        id="staticLastName"
                        name={"last_name"}
                        defaultValue={account.last_name}
                        onChange={event => this.handleInputChange(event)}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="staticFirstName"
                      className="col-sm-4 col-form-label"
                    >
                      Prénom(s)
                    </label>
                    <div className="col-sm-8">
                      <input
                        name={"first_name"}
                        required
                        type="text"
                        className="form-control"
                        id="staticFirstName"
                        defaultValue={account.first_name}
                        onChange={event => this.handleInputChange(event)}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-4 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-sm-8">
                      <input
                        required
                        type="text"
                        className="form-control"
                        id="staticEmail"
                        name={"email"}
                        defaultValue={account.email}
                        onChange={event => this.handleInputChange(event)}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="staticContact1"
                      className="col-sm-4 col-form-label"
                    >
                      Contact 1
                    </label>
                    <div className="col-sm-8">
                      <InputMask
                        mask="+225\ 99 99 99 99"
                        maskChar=" "
                        type="text"
                        id="staticContact1"
                        className="form-control"
                        placeholder="Contact 1"
                        name={"contact1"}
                        onChange={this.handleInputChange}
                        defaultValue={account.contact1}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="staticContact2"
                      className="col-sm-4 col-form-label"
                    >
                      Contact 2
                    </label>
                    <div className="col-sm-8">
                      <InputMask
                        mask="+225\ 99 99 99 99"
                        maskChar=" "
                        type="tel"
                        id="staticContact2"
                        className="form-control"
                        placeholder="Contact 2"
                        name={"contact2"}
                        onChange={this.handleInputChange}
                        defaultValue={account.contact2}
                        // required
                      />
                    </div>
                  </div>
                </div>

                <h5 className={"bg-light p-2"}>Résidence</h5>

                <div className="pr-3 pl-3">
                  <div className="form-group row">
                    <label
                      htmlFor="staticTown"
                      className="col-sm-4 col-form-label"
                    >
                      Ville
                    </label>
                    <div className="col-sm-8">
                      <select
                        className="custom-select d-block w-100"
                        required
                        id="staticTown"
                        name={"default_town"}
                        value={account.default_town}
                        onChange={event => this.handleInputChange(event)}
                      >
                        <option value={""}>Choisir une ville...</option>

                        {_.map(towns, (item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="staticMunicipality"
                      className="col-sm-4 col-form-label"
                    >
                      Commune
                    </label>
                    <div className="col-sm-8">
                      <select
                        className="custom-select d-block w-100"
                        required
                        id="staticMunicipality"
                        name={"default_commune"}
                        value={account.default_commune}
                        onChange={event => this.handleInputChange(event)}
                      >
                        <option value={""}>Choisir une commune...</option>

                        {_.map(communes, (item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="staticAddress"
                      className="col-sm-4 col-form-label"
                    >
                      Adresse
                    </label>
                    <div className="col-sm-8">
                      <input
                        placeholder={"Ex : INP-HB"}
                        required
                        type="text"
                        className="form-control"
                        id="staticAddress"
                        name={"default_address"}
                        defaultValue={account.default_address}
                        onChange={event => this.handleInputChange(event)}
                      />
                    </div>
                  </div>
                </div>

                <hr style={{ maxWidth: "100%" }} className={"mr-3 ml-3"} />

                <div className={"pr-3"}>
                  <div className="d-inline-block float-right">
                    <Link
                      className="btn btn-md btn-danger"
                      to={"/change-password"}
                    >
                      Changer le Mot de passe
                    </Link>
                    &nbsp;&nbsp;
                    <button
                      className={`btn btn-md btn-primary ${isLoading &&
                        "disabled"}`}
                      type="submit"
                      disabled={isLoading}
                    >
                      <span className="d-flex flex-row align-items-center">
                        Modifier{" "}
                        {isLoading && <span className="spinner spinner-grow" />}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <span> </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
    towns: state.towns,
    communes: state.communes,
    isLoading: state.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editProfile: account => {
      // TODO
      // console.log(account);
      dispatch(editUser(account));
    },
    sendEmailConfirmRequest: () => dispatch(authSendEmailConfirmRequest())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoPage);
