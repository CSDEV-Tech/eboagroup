import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

const BackgroundItemProduct = ({item, linkPrefix}) => {
    const path = window.location.pathname;
    return (
        <div
            className="card bg-primary mb-2"
            style={{
                height: "180px",
                backgroundImage: `url(${item.image})`,
                backgroundPosition: `center`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundOpacity: 0.5
            }}
        >
            <div
                className="overlay"
                style={{
                    zIndex: 2
                }}
            />

            <div
                className="card-img-overlay text-white"
                style={{
                    top: "unset",
                    zIndex: 3
                }}
            >
                <h5 className="card-title"
                    style={{
                        // fontSize: "large",
                        // // wordBreak: "break-word",
                        // wordWrap: "break-word"
                    }}
                >{item.name}</h5>
                {/*Return link dynamicaly if window is in search page or not*/}
                <Link
                    to={`${linkPrefix}/search?c=${item.slug}`}
                    className="btn btn-danger"
                    style={{
                        border: "2px solid #fff"
                    }}
                >
                    Découvrir
                </Link>
            </div>
        </div>
    );
};

export default BackgroundItemProduct;

BackgroundItemProduct.propTypes = {
    item: PropTypes.object.isRequired
};
