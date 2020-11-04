import {Link} from "react-router-dom";
import React from "react";
import _ from "lodash";

export const Featured = ({featured}) => (
    <header className="section-heading mb-5">
        <h4 className="title-section bg-light text-uppercase mb-4">La sélection BoaGroUp'</h4>
        <div className="row">
            <div className={featured.length > 1 ? "col-md-7 col-lg-8 d-flex" : "col-md-12"}>
                <Link to={`articles/${featured[0].slug}`}
                      className="card card-body card-overlay border-0 text-light mb-md-0 justify-content-end">
                    <div className="position-relative">
                        <span className="badge badge-primary">{featured[0].category_title}</span>
                        <div className="my-3">
                            <h2>{featured[0].title}</h2>
                        </div>
                        <div className="d-flex align-items-center">
                            {/*<img src={`${featured[0].image}`} alt="Avatar"*/}
                            {/*     className="avatar avatar-sm mr-2"/>*/}
                            <div>
                                <div className="flex-shrink-0"
                                     style={{textTransform: 'capitalize'}}>Par {featured[0].author.name}</div>
                            </div>
                        </div>
                    </div>
                    <img src={`${featured[0].image}`} alt={`Image article ${featured[0].title}`}
                         className="rounded bg-image"/>
                </Link>
            </div>

            {
                _.size(featured) > 1 && (
                    <div className="col-md-5 col-lg-4">
                        <ul className="list-unstyled list-articles">
                            {
                                _.slice(featured, 1).map(item => (
                                    <li key={item.slug} className="row row-tight mt-md-0 mt-3">
                                        <Link to={`articles/${item.slug}`} className="col-4 col-md-4">
                                            <img src={`${item.image}`} alt={`Image ${item.title}`}
                                                 className="rounded"/>
                                        </Link>

                                        <div className="col d-flex flex-column justify-content-between">
                                            <div>
                                                <Link to={`articles/${item.slug}`}>
                                                    <h6 className="mb-1 text-dark">{item.title}</h6>
                                                </Link>
                                                <span className="text-small text-secondary" dangerouslySetInnerHTML={{
                                                    __html: _.truncate(item.excerpt, {length: 70})
                                                }}/>
                                                <div className="d-flex text-small">
                                                    <Link to={`blog/search?c=${item.category_title}`}
                                                          className={`badge badge-danger mt-2`}>{item.category_title}</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            }

                        </ul>
                    </div>
                )
            }
        </div>
    </header>
);
