import React, {Component} from "react";
import logo from "../../PNG LOGO GRIS.png";
import {Link} from "react-router-dom";

class AboutPage extends Component {

    componentDidMount(): void {
        document.title = "BoaGroUp' - A propos"
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
                    }} className={"text-uppercase"}>A propos de Nous</h1>

                    <p className="leading text-justify m-3">
<b>BoaGroUp'</b> a été fondé par un étudiant, en classe d'ingénieur Logistique et Transports, passionné par le fait de créer quelque chose à partir de rien.

L'entreprise se veut être le premier e-commmerce ivoirien de vente d'Articles culturels et éducatifs.



Notre longue pratique nous permet d'assister correctement nos clients dans un éventail varié de styles et de tendances, l'idéal pour vous accompagner au-cours de vos activités.

​

BOAGROUP SERVICES met tout en œuvre pour fournir à tous nos clients la possibilité de laisser libre cours à leur créativité.

Nous vous invitons à parcourir notre site et trouver votre bonheur. Si vous avez des questions, n'hésitez pas à nous contacter.

                    </p>
                    <p className="mt-3 mb-3 text-muted">
                        <Link to="/">Retour à l'accueil</Link> <br/>
                        <Link to="/contact">Laissez-nous un message</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to="/terms-and-policy" style={{
                            whiteSpace: "no-wrap"
                        }}>Notre Politique de Livraison</Link>
                    </p>
                    <p className="mt-3 mb-3 text-muted">© <a href="#" target={"_blank"}>CSDEV</a> 2019</p>
                </div>
            </div>
        )
    }
}


export default AboutPage;
