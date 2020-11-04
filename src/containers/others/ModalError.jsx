import React, {useEffect} from 'react';
import $ from "jquery";

export const ModalError = ({error, onDismiss}) => {
    useEffect(() => {
        $('#itemToCartModal').modal('show').on('hidden.bs.modal', function (e) {
            onDismiss();
        });
    });

    return (
        <>
            <div className="modal fade" id="itemToCartModal" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-danger" id="itemToCartModalLabel">Une Erreur est
                                survenue</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <pre className={'alert alert-danger'}>
                                {
                                    error
                                }
                            </pre>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};