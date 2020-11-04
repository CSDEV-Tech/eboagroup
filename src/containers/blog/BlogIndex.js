import React, {Component} from "react";
import BlogHeader from "../../components/blog/BlogHeader";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {blogIndex} from "../../actions/blog";
import {Featured} from "../../components/blog/partials/Featured";
import ProductSlider from "../../components/ecommerce/partials/ProductSlider";
import {Popular} from "../../components/blog/partials/Popular";

// import {Link} from "react-router-dom";


class BlogIndex extends Component {
    // Properties Types
    static propTypes = {
        slides: PropTypes.arrayOf(PropTypes.object).isRequired,
        featured: PropTypes.arrayOf(PropTypes.object).isRequired,
        popular: PropTypes.arrayOf(PropTypes.object).isRequired,
        shop: PropTypes.arrayOf(PropTypes.object).isRequired,
        initBlog: PropTypes.func.isRequired,
    };


    componentDidMount(): void {
        // Init Blog
        document.title = `BoaGroUp' - Blog`;
        const {initBlog} = this.props;

        initBlog();
    }

    render() {
        const {slides, featured, shop, popular} = this.props;
        return (
            <>
                {/*Slider Article*/}
                <BlogHeader slides={slides}/>

                {/*Content*/}
                <div className="starter-template " style={{zIndex: 20}}>
                    <div className="container pl-5 pr-5">
                        {/*Featured Articles*/}
                        {
                            featured.length > 0 && (
                                <Featured featured={featured}/>
                            )
                        }

                        {/*Shop Products*/}
                        {
                            shop.length > 0 && (
                                <ProductSlider classes={"mb-4"} products={shop} title={"Produits de la boutique"}/>
                            )
                        }

                        {/*Popular Articles*/}
                        <header className="section-heading mb-4">
                            <h4 className="title-section bg-light text-uppercase mb-4">Articles populaires</h4>
                            {
                                popular.length > 0 && (
                                    <Popular articles={popular}/>
                                )
                            }
                        </header>


                        {/*Categories*/}
                        {
                            slides.length > 0 && (
                                <ProductSlider
                                    classes={"mb-4"}
                                    products={slides}
                                    linkPrefix={"blog"}
                                    title={"Plus de lecture"}
                                    type={"category"}/>
                            )
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        slides: state.blog_categories,
        popular: state.blog_popular,
        featured: state.blog_featured,
        shop: state.blog_shop,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initBlog: () => dispatch(blogIndex())
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BlogIndex);
