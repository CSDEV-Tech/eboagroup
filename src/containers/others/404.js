import React, {Component} from "react";
import {Link} from "react-router-dom";

class ErrorPage extends Component {
    componentDidMount(): void {
        document.title = `BoaGroUp' - Page non trouvée`
    }

    render() {
        return (
            <div className="starter-template mt-5 text-center mb-5">
                <h1>ERREUR 404 <span role="img" aria-label="Peur">⛔</span></h1>
                <p>Page non trouvée.</p>
                <Link to="/">
                    <button className="btn btn-primary">
                        Retour à l'accueil
                    </button>
                </Link>
            </div>
        );
    }
}

export default ErrorPage;

