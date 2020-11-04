import _ from "lodash";
import React from 'react';
import {Link} from "react-router-dom";

export const Popular = ({articles}) => (
    articles.map(item => (
        <div key={item.id} className="pr-lg-4">
            <div className="card card-article-wide flex-md-row no-gutters">
                <Link to={`articles/${item.slug}`} className="col-md-4">
                    <img src={`${item.image}`} alt={`${item.title}`} className="card-img-top"/>
                </Link>

                <div className="card-body d-flex flex-column col-auto p-4">
                    <div className="d-flex justify-content-between mb-3">
                        <div className="text-small d-flex">
                            <div className="mr-2">
                                <span className="badge badge-danger">
                                    <Link
                                        to={`blog/search?c=${item.category_title}`}
                                        className={"text-light"}
                                    >{item.category_title}</Link>
                                </span>
                            </div>
                            {/*<span className="text-muted">29th November</span>*/}
                        </div>
                        <span className="badge bg-primary-alt text-primary">
                      {/*<img className="icon icon-sm bg-primary" src="" alt="heart interface icon" data-inject-svg=""/>12*/}
                    </span>
                    </div>
                    <Link to={`articles/${item.slug}`} className="flex-grow-1">
                        <h3 className={'text-dark'}>{item.title}</h3>

                        <p className="lead text-muted" dangerouslySetInnerHTML={{
                           __html: _.truncate(item.excerpt, {length: 299})
                        }}/>
                    </Link>


                    <div className="d-flex align-items-center mt-3">
                        {/*<img src="assets/img/avatars/female-3.jpg" alt="Image" className="avatar avatar-sm"/>*/}
                        <div className="ml-1">
                            <span className="text-small text-muted">Ecrit Par</span>
                            {" "}
                            <span className="text-small">{item.author.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ))
);
