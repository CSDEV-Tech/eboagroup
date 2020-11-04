import React, {Component} from "react";
import PropTypes from "prop-types";
// import {connect} from "react-redux";
// import _ from "lodash";
import SearchFilters from "./partials/SearchFilters";

const ModalSearchFilters = (props) => {
    return (
        <>
            <div
                className="modal fade"
                id="filtersModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-uppercase">FILTRES</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body p-4">
                            <SearchFilters {...props}/>
                        </div>

                        <div className="modal-footer">
                            <button
                                className={"btn btn-secondary btn-large w-100"}
                                data-dismiss="modal"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalSearchFilters;
