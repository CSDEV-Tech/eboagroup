import logo from "../../PNG LOGO BLANC.png";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {faFacebookF, faInstagram} from "@fortawesome/free-brands-svg-icons/index";
import {faAt, faMapMarker, faPhone} from "@fortawesome/free-solid-svg-icons/index";
import $ from "jquery";
import NewsLetterForm from "../ecommerce/partials/NewsLetterForm";

class Footer extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }

    componentDidMount(): void {
        $("#logo").click((e) => {
            // e.preventDefault();
            // e.stopPropagation();

            $("html, body").animate(
                {
                    scrollTop: $("#top").offset().top
                },
                1000
            );
        });
    }

    render() {
        return (
            <footer className="p-5 bg-primary" id={"footer"}>
                <NewsLetterForm/>
                <hr style={{
                    border: ".5px solid #c0c0c0",
                    opacity: ".5"
                }}/>
                <div className="row">
                    <div className="col-12 col-md text-center">
                        <Link to="/#top">
                            <img className="mb-2 " src={logo} alt="logo" id={"logo"} width="100" height="100"/>
                        </Link>
                        <small className="d-block mb-3 text-light">© <a href="#" className={"text-white"}
                                                                        target={"_blank"}>CSDEV</a> 2019
                        </small>
                    </div>

                    <div className="col-12 col-md">
                        <h5 className="text-light"
                            style={{
                                fontSize: "1rem",
                                fontWeight: "bolder",
                            }}>Liens utiles</h5>
                        <ul className="list-unstyled text-small">
                            <li>
                                <Link className="text-light" to="/about" style={{
                                    fontSize: ".9rem"
                                }}>
                                    A propos
                                </Link>
                            </li>

                            <li>
                                <Link className="text-light" to="/terms-and-policy" style={{
                                    fontSize: ".9rem"
                                }}>
                                    Notre Politique de livraison
                                </Link>
                            </li>

                            <li>
                                <Link className="text-light" to="/contact" style={{
                                    fontSize: ".9rem"
                                }}>
                                    Contact
                                </Link>
                            </li>

                            <li>
                                <Link className="text-light" to="/blog" style={{
                                    fontSize: ".9rem"
                                }}>
                                    Le blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <hr style={{
                        border: ".5px solid #c0c0c0",
                        opacity: ".5",
                        width: "100%",
                    }} className={"showOnPhone"}/>

                    <div className="col-12 col-md text-footer">
                        <h5 className="text-light" style={{
                            fontSize: "1rem",
                            fontWeight: "bolder",
                        }}>Contacts</h5>
                        <ul className="list-unstyled text-small">
                            <li>
                                <a href={"mailto:boagroup01@gmail.com"} className={"text-light"}
                                   target={"_blank"}
                                   style={{fontSize: ".9rem"}}>
                                    <FontAwesomeIcon icon={faAt}/> boagroup01@gmail.com</a>
                            </li>

                            <li>
                                <a href={"tel:+22502332979"} className={"text-light"}
                                   target={"_blank"}
                                   style={{fontSize: ".9rem"}}>
                                    <FontAwesomeIcon icon={faPhone}/> (+225)
                                    02-33-29-79</a>
                            </li>

                            <li>
                                <span className={"text-light"}
                                      style={{fontSize: ".9rem"}}>
                                    <FontAwesomeIcon icon={faMapMarker}/> Côte d'Ivoire, Yamoussoukro
                                </span>
                            </li>
                        </ul>
                    </div>

                    <hr style={{
                        border: ".5px solid #c0c0c0",
                        opacity: ".5",
                        width: "100%",
                    }} className={"showOnPhone"}/>

                    <div className="col-12 col-md text-footer">
                        <h5 className="text-light"
                            style={{
                                fontSize: "1rem",
                                fontWeight: "bolder",
                            }}>Suivez-nous sur les Réseaux sociaux</h5>


                        <ul className="list-unstyled text-small row m-auto">
                            <li className={"mr-2"}>
                                <a className="btn btn-danger rounded text-light d-table text-center"
                                   target={"_blank"}
                                   href="//www.facebook.com/pg/BOAgroUp-297385187681418/shop/"
                                   style={{

                                       border: "2px solid #fff",
                                       width: "30px",
                                       height: "30px",
                                       fontSize: ".9rem",
                                   }}>
                                <span
                                    className={"d-table-cell align-middle"}>
                                    <FontAwesomeIcon icon={faFacebookF}/>
                                </span>
                                </a>
                            </li>

                            <li className={"mr-2"}>
                                <a className="btn btn-danger rounded text-light d-table text-center"
                                   target={"_blank"}
                                   href="//www.instagram.com/boagroup01?r=nametag"
                                   style={{
                                       border: "2px solid #fff",
                                       width: "30px",
                                       height: "30px",
                                       fontSize: ".9rem",
                                   }}>
                                <span
                                    className={"d-table-cell align-middle"}>
                                    <FontAwesomeIcon icon={faInstagram}/>
                                </span>
                                </a>
                            </li>

                        </ul>

                        <div className="mt-2">
                            <iframe
                                title={"Facebook plugin"}
                                src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2FBOAgroUp-297385187681418%2F&width=151&layout=button_count&action=like&size=small&show_faces=true&share=true&height=46&appId"
                                width="250" height="20" style={{border: "none", overflow: "hidden"}}
                                allow="encrypted-media"/>
                        </div>
                    </div>

                </div>
            </footer>
        );
    }
}

export default Footer;