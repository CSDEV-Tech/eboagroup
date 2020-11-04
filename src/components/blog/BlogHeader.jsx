import React from "react";
import OwlCarousel from 'react-owl-carousel2';
import {Link} from "react-router-dom";
import _ from "lodash";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import 'react-owl-carousel2/src/owl.theme.default.css';
import 'react-owl-carousel2/lib/styles.css'
// import $ from "jquery";
// import slide6 from "../../utils/images/slide6.jpg";
import default_bg from "../../utils/banners/bg-pattern.svg";

// alert($(window).width());

const owlOptions = {
    items: 1,
    rewind: true,
    dots: true,
    nav: false,
    autoplay: true,
    autoPlayTimer: 1500,
    autoHeight: true,
    navText: [
        '<button type="button" role="button" class="owl-prev text-light btn" style="height: 50px; ' +
        'background-color: rgba(0, 0, 0, 0.5); ' +
        'left: 30px;' +
        'z-index: 20' +
        '"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" class="svg-inline--fa fa-chevron-left fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg></button>',
        '<button  type="button" role="button" class="owl-next text-light btn" style="height: 50px; ' +
        'background-color: rgba(0, 0, 0, 0.5); ' +
        'right: 30px;' +
        'z-index: 20' +
        '"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-w-10 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg></button>'
    ],
};

// const SlidesHeader = ({slides}) => {
//     return (
//         <React.Fragment>
//             {_.size(slides) > 0 && (
//                 <OwlCarousel options={owlOptions}>
//                     {_.map(slides, (slide) => (
//                         !!slide.promotion_related_id ? (
//                             <Link key={slide.order} to={`/cart?promo=${slide.promotion_related_id}`}>
//                                 <div style={{
//                                     backgroundImage: `url(${slide.image})`,
//                                     backgroundSize: "contain",
//                                     backgroundRepeat: "no-repeat",
//                                     backgroundPosition: "top",
//                                     position: "relative",
//                                     height: "100%",
//                                 }}
//                                 />
//                             </Link>
//                         ) : (
//                             <span key={slide.order}>
//                                 <div style={{
//                                     backgroundImage: `url(${slide.image})`,
//                                     backgroundSize: "contain",
//                                     backgroundRepeat: "no-repeat",
//                                     backgroundPosition: "top",
//                                     position: "relative",
//                                     height: "100%",
//                                 }}
//                                 />
//                             </span>
//                         )))}
//                 </OwlCarousel>
//             )}
//         </React.Fragment>
//     )
// };


const FeatureHeader = ({slides}) => {
    return (
        <OwlCarousel options={owlOptions}>
            {_.map(slides, (slide) => (
                <React.Fragment key={slide.slug}>
                    {slide.featured_title != null && (
                        <div className="header-content d-flex" key={slide.order} style={{
                            backgroundImage: `url(${slide.featured_image !== null ? (slide.featured_image) : default_bg})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center center",
                            width: "100%",
                        }}>
                            <div className="overlay">
                            </div>
                            <div className="row w-100 m-0" style={{
                                zIndex: 2
                            }}>
                                <div className="col-md-6">
                                    <div className="h-100 w-100 text-uppercase fl-sm">
                                        <div className="w-100 m-l">
                                            <div className="mb-4">
                                                {/*<h3 className={"lead my-leading"}>{slide.featured_author}</h3>*/}
                                                <small className="badge small-text badge-danger"
                                                       style={{
                                                           fontWeight: "400"
                                                       }}>
                                                    {slide.name}
                                                </small>
                                                <h2 className={"my-title"}>{slide.featured_title} </h2>

                                                {/*<h4 className={"my-subtitle"}>{slide.subtitle} </h4>*/}
                                                <h3 className={"lead my-leading"} style={{
                                                    textTransform: "capitalize"
                                                }}>{slide.featured_author ? `Par ${slide.featured_author}` : "Revenez plus tard"}</h3>
                                                {/*<h3 className={"lead my-leading"}>{slide.featured_date}</h3>*/}
                                            </div>

                                            {
                                                slide.featured_slug && (
                                                    <Link to={`/articles/${slide.featured_slug}`}
                                                          className="btn btn-danger">Lire l'article</Link>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="col-md-6 hideOnPhone">*/}
                                {/*    <img src={slide.image} alt="alter" className={"w-auto h-100 m-auto"}*/}
                                {/*         style={{*/}
                                {/*             maxWidth: "100%",*/}
                                {/*             maxHeight: "300px",*/}
                                {/*             objectFit: "cover",*/}
                                {/*         }}/>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))
            }
        </OwlCarousel>
    );
};

const BlogHeader = ({slides}) => {
    // console.log("slides ==> ", slides);

    return (
        <header className="mb-3 header" style={{}}>
            {slides.length > 0 ? (
                    <FeatureHeader slides={slides}/>
                ) :
                <FeatureHeader slides={[
                    {
                        "name": "désolé",
                        "slug": "#",
                        "image": null,
                        "featured_title": "Aucun Article pour l'instant",
                        "featured_author": null,
                        "featured_date": "2020-07-26",
                        "featured_image": null,
                        "featured_slug": null
                    },
                ]}/>
            }
        </header>
    );
};


const mapStateToProps = (state, ownProps) => {
    return {
        slides: ownProps.slides,
    }
};

export default connect(mapStateToProps)(BlogHeader);

BlogHeader.propTypes = {
    slides: PropTypes.arrayOf(PropTypes.object).isRequired
};