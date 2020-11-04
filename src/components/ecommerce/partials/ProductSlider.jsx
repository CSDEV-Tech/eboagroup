import OwlCarousel from "react-owl-carousel2";
import ItemProduct from "./CardItemProduct";
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import 'react-owl-carousel2/src/owl.theme.default.css';
import 'react-owl-carousel2/lib/styles.css'
import LargeItemProduct from "./LargeItemProduct";
import BackgroundItemProduct from "./BackgroundItemProduct";

const getSliderOptions = ({type = "card", size, maxItems}) => {
    return {
        responsive: {
            0: {
                items: (type === "card" ? 2 : (type === "large" ? 1 : 2)),
                loop: ((size > 2 && type === "card") || (size > 1 && type === "large") || (!type === "category")),
            },
            768: {
                items: (type === "card" ? 3 : (type === "large" ? 2 : 3)),
                loop: ((size > 3 && type === "card") || (size > 2 && type === "large") || (!type === "category")),
            },
            1000: {
                items: (type === "card" ? maxItems : (type === "large" ? 2 : maxItems)),
                loop: ((size > maxItems && type === "card") || (size > 2 && type === "large") || (!type === "category")),
            },
            1500: {
                items: (type === "card" ? maxItems : (type === "large" ? 2 : maxItems)),
                loop: ((size > maxItems && type === "card") || (size > 2 && type === "large") || (!type === "category")),
            }
        },
        margin: 20,
        nav: true,
        dots: false,
        autoplay: true,
        autoPlayTimer: 1500,
        rewind: (type === "category"),
        navText: [
            '<button type="button" role="button" class="owl-prev text-light btn" style="height: 50px; width: 30px; background-color: rgba(0, 0, 0, 0.5); left: 30px;z-index: 20"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" class="svg-inline--fa fa-chevron-left fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg></button>',
            '<button type="button" role="button" class="owl-next text-light btn" style="height: 50px; width: 30px; background-color: rgba(0, 0, 0, 0.5); right: 30px;z-index: 20"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg></button>'
        ],
    };
};

const ProductSlider = ({products: items, title, type = "card", classes = "", linkPrefix = "", hr = false, maxItems = 4}) => {
    const size = _.size(items);

    return (
        <section className={`product-slider ${classes}`}>
            {
                !hr ? (
                    <header className="section-heading heading-line">
                        <h4 className="title-section bg-light text-uppercase">{title}</h4>
                    </header>
                ) : (
                    <h4 className={'text-uppercase mb-4'}>{title}</h4>
                )
            }
            {
                type === "card" ? (
                        _.size(items) > 0 && (
                            (
                                <OwlCarousel options={getSliderOptions({type: type, size, maxItems})}>
                                    {items.map((item) => (
                                        <ItemProduct item={item} key={item.id}/>
                                    ))}
                                </OwlCarousel>
                            )
                        )
                    ) :
                    (type === "large" ? (
                        <>
                            {_.size(items) > 0 && (
                                (
                                    <OwlCarousel options={getSliderOptions({type: type, size, maxItems})}>
                                        {items.map((item) => (
                                            <LargeItemProduct item={item} key={item.id}/>
                                        ))}
                                    </OwlCarousel>
                                )
                            )}
                        </>
                    ) : (<>
                        {_.size(items) > 0 && (
                            (
                                <OwlCarousel options={getSliderOptions({type: type, size, maxItems})}>
                                    {items.map((item) => (
                                        <BackgroundItemProduct linkPrefix={linkPrefix} item={item} key={item.id}/>
                                    ))}
                                </OwlCarousel>
                            )
                        )}
                    </>))
            }
        </section>
    )
};

export default ProductSlider;

ProductSlider.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string
};