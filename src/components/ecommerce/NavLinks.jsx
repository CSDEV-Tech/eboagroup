import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {faHome} from "@fortawesome/free-solid-svg-icons/index";
import _ from "lodash";
import {connect} from "react-redux";

const NavLinks = ({categories, currentPath, promotions}) => {
    const active = currentPath.pathname;
    // const params = currentPath.params;

    // The five first Categories
    const firstCategories = _.filter(categories, (cat, key) => key < 5);

    // The other categories
    const otherCategories = _.filter(categories, (cat, key) => key >= 5);

    return (
        <React.Fragment>
            <div className="collapse navbar-collapse" id="navBar">
                <ul className="navbar-nav mr-auto">
                    <li className={`nav-item ${active === "/" ? "active" : ""}`}>
                        <Link to="/" className="nav-link">
                            <FontAwesomeIcon icon={faHome}/> Boutique
                        </Link>
                    </li>

                    {_.size(firstCategories) > 0 && (
                        <li className={`nav-item dropdown`}>
                            <Link
                                to="#"
                                className="nav-link text-white dropdown-toggle"
                                id="moreDropDown"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                            >
                                Catégories
                            </Link>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="moreDropDown"
                                style={{
                                    maxHeight: "165px",
                                    overflowY: "scroll"
                                }}
                            >
                                {_.map(firstCategories, item => (
                                    <React.Fragment key={item.id}>
                                        <Link
                                            className="dropdown-item"
                                            to={`/search?c=${item.slug}`}
                                        >
                                            {item.name}
                                        </Link>
                                    </React.Fragment>
                                ))}

                                {_.size(otherCategories) > 0 && (
                                    <>
                                        <Link className="dropdown-item" to={`/search`}>
                                            Plus...
                                        </Link>
                                    </>
                                )}
                            </div>
                        </li>
                    )}

                    {_.size(promotions) > 0 && (
                        <li className={`nav-item dropdown`}>
                            <Link
                                to="#"
                                className="nav-link text-white dropdown-toggle"
                                id="promoDropDown"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                            >
                                Soldes
                            </Link>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="promoDropDown"
                                style={{
                                    maxHeight: "165px",
                                    overflowY: "scroll"
                                }}
                            >
                                {_.map(promotions, item => (
                                    <Link
                                        key={item.id}
                                        className="dropdown-item"
                                        to={`/sales/${item.slug}`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </li>
                    )}

                    <li className={`nav-item`}>
                        <Link to="/blog" className="nav-link text-white">
                            Le Blog
                        </Link>
                    </li>


                </ul>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        categories: state.categories,
        promotions: state.promotions,
        currentPath: state.currentPath
    };
};

export default connect(mapStateToProps)(NavLinks);

NavLinks.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentPath: PropTypes.object.isRequired,
    promotions: PropTypes.arrayOf(PropTypes.object).isRequired
};
