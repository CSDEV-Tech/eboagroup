import React, {Component} from "react";
import $ from 'jquery';
import "../../../utils/css/bootstrap-drawer.css";
// import logo from "../../logo.jpeg";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import _ from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

class SideDrawer extends Component {

    componentDidMount() {

        $("#drawer-overlay").click(this.closeDrawer);

        $("#drawer-closer").click(this.closeDrawer);

        $("#drawer-toggler").click(this.openDrawer);
    }

    closeDrawer = () => {
        $("#drawer-1").removeClass("open");
        $("#drawer-overlay").fadeOut(350);
    };

    openDrawer = () => {
        $("#drawer-1").addClass("open");
        $("#drawer-overlay").fadeIn(350);
    };

    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.object),
        promotions: PropTypes.arrayOf(PropTypes.object),
    };

    render() {
        const {categories, promotions} = this.props;

        // The five first Categories
        const firstCategories = _.filter(categories, (cat, index) => index < 5);

        // The other categories
        const otherCategories = _.filter(categories, (cat, index) => index >= 5);

        return (
            <React.Fragment>
                <div id="drawer-overlay" style={{
                    display: "none"
                }}>
                </div>

                <nav className="side-drawer" id="drawer-1">
                    <Link to={"/"} onClick={this.closeDrawer}>
                        <header className="p-3">
                            <style>
                                @import url('https://fonts.googleapis.com/css?family=Merienda+One&display=swap');
                            </style>
                            <div className="h4 d-flex flex-row align-items-center h-100 w-100"
                                 style={{
                                     fontFamily: "'Merienda One', sans-serif"
                                 }}>
                                <div className={"text-center w-100"} style={{
                                    color: "grey",
                                    fontStyle: "italic",
                                    fontWeight: "bold",
                                }}>
                                    <div>Boa<b className={"text-primary"}>G</b>roUp' &nbsp;</div>
                                    <div className={"text-warning h6"}>Professionnal Services</div>
                                </div>
                            </div>
                        </header>
                    </Link>
                    <hr className={"m-0"}/>

                    <ul className={"side-nav"}>

                        <Link to={"/blog"} className={"text-light"} onClick={this.closeDrawer}>
                            <li className={"accordion-list bg-primary"}>
                                <div className={"text-small"}>
                                    Le Blog
                                </div>
                                <div style={{float: "right"}}><FontAwesomeIcon icon={faChevronRight}/></div>
                            </li>
                        </Link>


                        <li className={"accordion-list bg-primary"}
                            data-toggle="collapse"
                            data-target="#collapseCategories"
                            aria-expanded="false"
                            aria-controls="collapseCategories">
                            <div className={"text-small"}>Catégories</div>
                            <div style={{float: "right"}}><FontAwesomeIcon icon={faBars}/></div>
                        </li>

                        {/*Inner list*/}
                        <ul className={"collapse sub-list"} id="collapseCategories">
                            {_.map(firstCategories, item => (
                                <React.Fragment key={item.id}>
                                    <Link to={`/search?c=${item.slug}`} className={"side-item"}
                                          onClick={this.closeDrawer}>
                                        <FontAwesomeIcon icon={faChevronRight}/>
                                        &nbsp;&nbsp;{item.name}
                                    </Link>
                                </React.Fragment>
                            ))}
                            {
                                _.size(otherCategories) > 0 && (
                                    <>
                                        <Link to={`/search`} className={"side-item"}
                                              onClick={this.closeDrawer}>
                                            <FontAwesomeIcon icon={faChevronRight}/>
                                            &nbsp;&nbsp;Plus de catégories
                                        </Link>
                                    </>
                                )
                            }
                        </ul>

                        <li className={"accordion-list bg-primary"}
                            data-toggle="collapse"
                            data-target="#collapsePromo"
                            aria-expanded="false"
                            aria-controls="collapsePromo">
                            <div className={"text-small"}>Soldes</div>
                            <div style={{float: "right"}}><FontAwesomeIcon icon={faBars}/></div>
                        </li>

                        {/*Inner list*/}
                        <ul className={"collapse  sub-list"} id="collapsePromo">
                            {_.map(promotions, item => (
                                <React.Fragment key={item.id}>
                                    <Link to={`/sales/${item.slug}`} className={"side-item"}
                                          onClick={this.closeDrawer}>
                                        <FontAwesomeIcon icon={faChevronRight}/>
                                        &nbsp;&nbsp;{item.label}
                                    </Link>
                                </React.Fragment>
                            ))}
                            <hr className={"br"}/>
                        </ul>

                    </ul>
                </nav>
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => {
    return {
        categories: _.filter(state.categories, item => !item.parent),
        promotions: state.promotions,
    };
};

export default connect(mapStateToProps)(SideDrawer);


