import React, {Component} from "react";
import logo from "../../PNG LOGO GRIS.png";
import {Link} from "react-router-dom";

class TermsPage extends Component {

    componentDidMount(): void {
        document.title = "BoaGroUp' - Politique de Livraison"
    }

    render() {
        return (
            <div className="text-center h-100 bg-light body container">
                <div
                >
                    <Link to="/" title={"Retour à l'accueil"}>
                        <img className="mb-4" src={logo} alt="" width="100" height="100"/>
                    </Link>

                    <h1 style={{
                        fontSize: "x-large"
                    }} className={"text-uppercase"}>Notre Politique de Livraison</h1>

                    <p className="leading text-justify m-3">
                        <span>
                            Une fois que vos choix ont été enregistrés,
                            l'un de nos agents vous contactera pour discuter de la conformité de votre commande
                            et des éléments disponibles dans nos stocks.
                            après avoir choisi le payement par mobile money ou celui à la livraison,
                            votre livraison se fera en moins de 48 heures.
                    </span>
                    </p>
                    <p className="mt-3 mb-3 text-muted">
                        <Link to="/">Retour à l'accueil</Link> <br/>
                        <Link to="/contact">Laissez-nous un message</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to="/about" style={{
                            whiteSpace: "no-wrap"
                        }}>A propos de nous</Link>
                    </p>
                    <p className="mt-3 mb-3 text-muted">© <a href="#" target={"_blank"}>CSDEV</a> 2019</p>
                </div>
            </div>
        )
    }
}


export default TermsPage;
