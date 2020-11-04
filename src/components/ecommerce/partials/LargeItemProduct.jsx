import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

const LargeItemProduct = ({item}) => {

    return (
        <figure className="card card-product">
            <Link to={`/sales/${item.slug}`}>

                <div className="card-banner">
                    <div className="card-body" style={{
                        height: "180px",
                        backgroundImage: `url(${item.image})`,
                        backgroundPosition: `center`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}>
                    </div>

                     {/*<span className="badge-offer" style={{*/}
                     {/*    zIndex: 12*/}
                     {/*}}>*/}
                     {/*    <b>{item.total} FCFA</b>*/}
                     {/*</span>*/}
                    <div className="text-bottom"><h5 className="title">{item.label} <span
                        className="badge badge-warning">{item.total} FCFA</span></h5></div>

                </div>
            </Link>
        </figure>
    );
};


export default LargeItemProduct;

LargeItemProduct.propTypes = {
    item: PropTypes.object.isRequired,
};
