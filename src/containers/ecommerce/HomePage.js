import React, {Component} from "react";
import ProductSlider from "../../components/ecommerce/partials/ProductSlider";
import HowTo from "../../components/ecommerce/partials/HowTo";
import Header from "../../components/ecommerce/partials/MainHeader";
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import _ from "lodash";


class HomePage extends Component {

    // Properties Types
    static propTypes = {
        products: PropTypes.arrayOf(PropTypes.object).isRequired,
        promotions: PropTypes.arrayOf(PropTypes.object).isRequired,
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    componentDidMount(): void {
        // Init App
        document.title = `BoaGroUp' - Service de vente en ligne`;
    }

    render() {
        const {products, promotions, categories} = this.props;

        let new_articles = _.filter(
            _.sortBy(products, product => product.name), item => item.is_new === "Oui"
        );

        return (
            <React.Fragment>
                {/*Header*/}
                <Header/>

                {/*Products section*/}
                <div className="starter-template " style={{zIndex: 20}}>
                    <div className="container pl-4 pr-4">
                        <div className="mb-5">
                            {promotions.length > 0 && (
                                <ProductSlider
                                    products={promotions}
                                    title="Les meilleures soldes du moment"
                                    type={"large"}/>
                            )}


                            {new_articles.length > 0 && (
                                <ProductSlider
                                    products={new_articles}
                                    title="Ils font l'actu"
                                />
                            )}

                            {categories.length > 0 && (
                                <ProductSlider
                                    classes={"mb-4"}
                                    products={_.filter(categories, item => !item.parent)}
                                    title="Nos catégories"
                                    type={"category"}/>
                            )}
                        </div>
                        <HowTo/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        products: state.latestAndPromotionalProducts,
        promotions: _.filter(state.promotions, sale => sale.stock > 0),
        categories: state.categories,
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

