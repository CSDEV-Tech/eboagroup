import React, {Component} from "react";
import CartButton from "./CartButton";
import NavLinks from "./NavLinks";
import NavHeader from "./partials/NavHeader";
import AccountButton from "./AccountButton";
import $ from 'jquery';
import SideDrawer from "./partials/SideDrawer";

class NavBar extends Component {

    componentDidMount() {
        const top = $("#navlinks")[0].offsetTop;
        window.onscroll = () => {
            if (document.documentElement.scrollTop >= top) {
                $("#navlinks").addClass("fixed-top");
            } else {
                $("#navlinks").removeClass("fixed-top");
            }
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="bg-primary border-bottom shadow-sm">
                    {/*Nav Header*/}
                    <NavHeader/>

                    {/*Nav*/}
                    <nav className={`navbar navbar-expand-lg navbar-dark bg-primary`} id="navlinks">
                        <button
                            className="navbar-toggler"
                            type="button"
                            id={"drawer-toggler"}
                            aria-expanded="false"
                            data-toggle="drawer"
                            data-target="#drawer-3"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"/>
                        </button>

                        {/*NavLinks*/}
                        <NavLinks/>


                        <div className="row mr-2">

                            {/*Account Button */}
                            <div className="mr-2">
                                <AccountButton/>
                            </div>

                            {/*Cart*/}
                            <div className="mr-2">
                                <CartButton/>
                            </div>

                        </div>
                    </nav>
                </div>

                <SideDrawer />
            </React.Fragment>
        );
    }
}

export default NavBar;

