import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import {
  faPhone,
  faShippingFast,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons/index";
import React from "react";

const HowTo = () => (
  <section id="how-to" className="">
    <header className="section-heading heading-line">
      <h4 className="title-section bg-light">COMMENT ACHETER ?</h4>
    </header>
    <div className="row">
      <div className="col-md-4 mb15 mb-5">
        <article className="box h-100 card-product card">
          <figure className="itembox  text-center">
            <span className="mt-2 icon-wrap rounded icon-sm bg-success text-light">
              <FontAwesomeIcon icon={faShoppingCart} />
            </span>
            <figcaption className="text-wrap">
              <h5 className="title">Faites votre commande en ligne</h5>
              <p className="text-muted">
                Choisissez vos produits et remplissez les différentes
                informations.
              </p>
            </figcaption>
          </figure>
        </article>
      </div>
      <div className="col-md-4 mb15 mb-5">
        <article className="box h-100  card-product card">
          <figure className="itembox text-center">
            <span className="mt-2 icon-wrap rounded icon-sm bg-warning text-light">
              <FontAwesomeIcon icon={faPhone} />
            </span>
            <figcaption className="text-wrap">
              <h5 className="title">Répondez à notre appel</h5>
              <p className="text-muted">
                Nous vous appelerons pour confirmer votre achat.
              </p>
            </figcaption>
          </figure>
        </article>
      </div>
      <div className="col-md-4 mb15 mb-5">
        <article className="box h-100  card-product card">
          <figure className="itembox text-center">
            <span className="mt-2 icon-wrap rounded icon-sm bg-primary text-light">
              <FontAwesomeIcon icon={faShippingFast} />
            </span>
            <figcaption className="text-wrap">
              <h5 className="title">Recevez votre commande</h5>
              <p className="text-muted">
                Depuis chez vous, recevez la commande sans vous déplacer.
              </p>
            </figcaption>
          </figure>
        </article>
      </div>
    </div>
  </section>
);

export default HowTo;
