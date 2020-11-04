import React, {Component} from "react";
import {Link} from "react-router-dom";
import ProductSlider from "../../components/ecommerce/partials/ProductSlider";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import ProductDetailShow from "../../components/ecommerce/ProductDetailShow";
import _ from "lodash";
import ErrorPage from "../others/404";


class ProductDetailPage extends Component {

    static propTypes = {
        products: PropTypes.arrayOf(PropTypes.object),
    };

    componentDidMount(): void {
        document.title = `BoaGroUp' - Détail du produit`
    }

    render() {
        const {match, products} = this.props;
        const slug = match.params.slug;

        let product = _.find(products, (item) => (item.slug === slug));
        let relatedProducts = [];
        if(product) {
              relatedProducts = _.filter(products, (item) => {
                return (
                    (item.category.slug === product.category.slug
                        // || ((item.promotion !== null && product.promotion !== null) && (item.promotion.label === product.promotion.label))
                    ) && (item !== product)
                )
            });
        }

        // console.log(product, products);

        return (
            product ? (
                    <div className="container mb-5 mt-5">
                        {/*BREADCRUMB*/}
                        <nav aria-label="breadcrumb" className="w-100">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                                <li className="breadcrumb-item"><Link to="/search">Produits</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                            </ol>
                        </nav>

                        {/*PRODUCT*/}
                        <ProductDetailShow item={product} />

                        {/* RELATED */}
                        {
                            _.size(relatedProducts) > 0 && (
                                <ProductSlider products={relatedProducts} title="ça pourrait vous intéresser"/>
                            )
                        }
                    </div>
                ) :
                (
                    <>
                        <ErrorPage />
                    </>
                )
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        products: state.latestAndPromotionalProducts,
        match: ownProps.match,
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailPage);
