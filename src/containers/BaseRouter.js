import {Router, Route, Switch} from "react-router-dom";
import React, {Component} from "react";
import HomePage from "./ecommerce/HomePage";
import CartPage from "./ecommerce/CartPage";
import ErrorPage from "./others/404";
import NavBar from "../components/ecommerce/NavBar";
import PropTypes from "prop-types";
import SearchPage from "./ecommerce/SearchPage";
import Footer from "../components/others/Footer";
import WishListPage from "./ecommerce/WishListPage";
import LoginSignupPage from "./auth/LoginSignupPage";
import ProductDetailPage from "./ecommerce/ProductDetailPage";
import AccountPage from "./auth/AccountPage";
import CommandListPage from "./ecommerce/CommandListPage";
import ModalAddProduct from "../components/ecommerce/ModalAddProduct";
import {connect} from "react-redux";
import CheckoutPage from "./ecommerce/CheckoutPage";
import CommandDetailPage from "./ecommerce/CommandDetailPage";
import UserInfoPage from "./auth/UserInfoPage";
import SaleDetailPage from "./ecommerce/SaleDetailPage";
import ContactPage from "./others/ContactPage";
import AboutPage from "./others/AboutPage";
import TermsPage from "./others/TermsPage";
import BlogIndex from "./blog/BlogIndex";
import BlogDetail from "./blog/BlogDetail";
import BlogSearch from "./blog/BlogSearch";

class BaseRouter extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        item: PropTypes.object
    };

    render() {
        return (
            <React.Fragment>
                <Router history={this.props.history}>
                    <Switch>
                        <Route exact path="/login" component={() => <></>}/>
                        <Route exact path="/signup" component={() => <></>}/>

                        <Route exact path="/forgot-password" component={() => <></>}/>

                        <Route exact path="/change-password" component={() => <></>}/>

                        <Route exact path="/checkout" component={() => <></>}/>

                        <Route exact path="/contact" component={() => <></>}/>

                        <Route exact path="/about" component={() => <></>}/>

                        <Route exact path="/terms-and-policy" component={() => <></>}/>

                        <Route
                            exact
                            path="/password-reset/:token"
                            component={() => <></>}
                        />

                        <Route exact path="/email-confirm/:token" component={() => <></>}/>

                        <Route component={NavBar}/>
                    </Switch>

                    <Switch>
                        <Route exact path="/login" component={() => <></>}/>

                        <Route exact path="/signup" component={() => <></>}/>

                        <Route exact path="/forgot-password" component={() => <></>}/>

                        <Route exact path="/change-password" component={() => <></>}/>
                        <Route
                            exact
                            path="/password-reset/:token"
                            component={() => <></>}
                        />

                        <Route exact path="/email-confirm/:token" component={() => <></>}/>

                        <Route exact path="/checkout" component={() => <></>}/>

                        <Route exact path="/contact" component={() => <></>}/>

                        <Route exact path="/about" component={() => <></>}/>

                        <Route exact path="/terms-and-policy" component={() => <></>}/>

                        <Route exact path="/blog" component={BlogIndex}/>
                        <Route exact path="/articles/:slug" component={BlogDetail}/>

                        <Route exact path="/" component={HomePage}/>
                        <Route exact path="/cart" component={CartPage}/>
                        <Route exact path="/p/:slug" component={ProductDetailPage}/>
                        <Route exact path="/sales/:slug" component={SaleDetailPage}/>
                        <Route
                            exact
                            path="/search"
                            component={() => <SearchPage history={this.props.history}/>}
                        />
                        <Route
                            exact
                            path="/blog/search"
                            component={() => <BlogSearch history={this.props.history}/>}
                        />
                        <Route exact path="/account" component={AccountPage}/>
                        <Route exact path="/account/wishlist" component={WishListPage}/>
                        <Route exact path="/account/commands" component={CommandListPage}/>
                        <Route
                            exact
                            path="/account/commands/:ref"
                            component={CommandDetailPage}
                        />
                        <Route exact path="/account/user-info" component={UserInfoPage}/>
                        <Route component={ErrorPage}/>
                    </Switch>

                    <Switch>
                        <Route exact path="/contact" component={() => <ContactPage/>}/>

                        <Route
                            exact
                            path="/login"
                            component={() => (
                                <LoginSignupPage
                                    history={this.props.history}
                                    action={"login"}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/signup"
                            component={() => (
                                <LoginSignupPage
                                    history={this.props.history}
                                    action={"signup"}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/forgot-password"
                            component={({match}) => (
                                <LoginSignupPage
                                    match={match}
                                    history={this.props.history}
                                    action={"forgotPassword"}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/change-password"
                            component={({match}) => (
                                <LoginSignupPage
                                    match={match}
                                    history={this.props.history}
                                    action={"changePassword"}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/password-reset/:token"
                            component={({match}) => (
                                <LoginSignupPage
                                    match={match}
                                    history={this.props.history}
                                    action={"passwordReset"}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/email-confirm/:token"
                            component={({match}) => (
                                <LoginSignupPage
                                    match={match}
                                    history={this.props.history}
                                    action={"confirmEmail"}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/checkout"
                            component={() => <CheckoutPage history={this.props.history}/>}
                        />

                        <Route exact path="/about" component={() => <AboutPage/>}/>

                        <Route
                            exact
                            path="/terms-and-policy"
                            component={() => <TermsPage/>}
                        />

                        <Route component={Footer}/>
                    </Switch>
                    {this.props.item && <Route component={ModalAddProduct}/>}
                </Router>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        item: state.selectedProduct,
        history: ownProps.history
    };
};

export default connect(mapStateToProps)(BaseRouter);
