import React from "react";
import {connect} from "react-redux";
import $ from "jquery";
import {subscribeNewsletter} from "../../../actions/blog";

const NewsLetterForm = ({sucribeToNewsletter}) => {
    return (
        <div className={"d-flex align-items-center flex-row"} style={{
            maxHeight: "50px",
        }}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const $input = $('#suscribe');
                    sucribeToNewsletter($input.val());
                    $input.val("");
                }}>
                <label htmlFor="suscribe" className={"text-light"}>Souscrire à la newsletter</label>
                <div className="input-group mb-5">
                    <input type="email" id={"suscribe"} placeholder="Email" className="form-control"
                           style={{
                               maxWidth: ""
                           }} required/>
                    <span className="input-group-append">
                        <button type="submit" className="btn btn-danger"
                                style={{
                                    border: "2px solid #fff",
                                    padding: "2px 1rem",
                                }}> Valider
                        </button>
                    </span>
                </div>
            </form>
        </div>
    );
};


const mapDispatchToProps = dispatch => {
    return {
        sucribeToNewsletter: (email) => dispatch(subscribeNewsletter(email))
    }
};

export default connect(null, mapDispatchToProps)(NewsLetterForm);