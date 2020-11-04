import React, {Component} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {faHeart, faShoppingBag, faUser} from "@fortawesome/free-solid-svg-icons/index";


class AccountPage extends Component {
    componentDidMount(): void {
        document.title = `BoaGroUp' - Compte`
    }

    render() {
        return (
            <div className="starter-template mb-5 mt-5 container">
                <nav aria-label="breadcrumb" className="w-100">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Compte</li>
                    </ol>
                </nav>

                <section id="how-to" className="">
                    <header className="section-heading heading-line">
                        <h4 className="title-section bg-light">TABLEAU DE BORD</h4>
                    </header>
                    <div className="row">
                        <div className="col-md-4 mb15 mb-5">
                            <Link to="/account/user-info">
                                <article className="box h-100 card-product card">
                                    <figure className="itembox  text-center">
                    <span className="mt-2 icon-wrap rounded icon-sm bg-primary text-light">
                        <FontAwesomeIcon icon={faUser}/>
                    </span>
                                        <figcaption className="text-wrap">
                                            <h5 className="title" style={{color: "black"}}>Mes informations personnelles</h5>
                                            <p className="text-muted">
                                                Voir ou modifier mes informations personnelles.
                                            </p>
                                        </figcaption>
                                    </figure>
                                </article>
                            </Link>
                        </div>

                        <div className="col-md-4 mb15 mb-5">
                            <Link to="/account/commands">
                                <article className="box h-100  card-product card">
                                    <figure className="itembox text-center">
                        <span className="mt-2 icon-wrap rounded icon-sm bg-warning text-light">
                            <FontAwesomeIcon icon={faShoppingBag}/>
                        </span>
                                        <figcaption className="text-wrap">
                                            <h5 className="title" style={{color: "black"}}>Mes commandes</h5>
                                            <p className="text-muted">
                                                Consulter mes commandes.
                                            </p>
                                        </figcaption>
                                    </figure>
                                </article>
                            </Link>
                        </div>

                        <div className="col-md-4 mb15 mb-5">
                            <Link to="/account/wishlist">
                                <article className="box h-100  card-product card">
                                    <figure className="itembox text-center">
                        <span className="mt-2 icon-wrap rounded icon-sm bg-danger text-light">
                            <FontAwesomeIcon icon={faHeart}/>
                        </span>
                                        <figcaption className="text-wrap">
                                            <h5 className="title" style={{color: "black"}}>Ma liste de souhaits</h5>
                                            <p className="text-muted">
                                                Consulter Les articles mis de côté pour plus tard.
                                            </p>
                                        </figcaption>
                                    </figure>
                                </article>
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}

export default AccountPage;