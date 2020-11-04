import {Link} from "react-router-dom";
import {getPath} from "../../../actions";
import {getMonth} from "../../../utils/functions";
import _ from "lodash";
import React from "react";

const CardArticle = ({item}) => (
    <>
        <div className="card" style={{
            // height: "520px"
        }}>
            <Link to={`/articles/${item.slug}`}>
                <div
                    className={"align-items-center flex-row d-flex img-wrap"}
                    style={{
                        borderRadius: "0.2rem 0.2rem 0 0",
                        overflow: "hidden",
                        position: "relative",
                        height: "220px",
                        textAlign: "center",
                    }}
                >
                    <img src={getPath(item.image, 'blog')}
                         style={{
                             maxHeight: "100%",
                             width: "auto"
                         }}
                         alt="Image"
                         className="card-img-top d-inline-block center-x"/>
                </div>
            </Link>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                    <div className="text-small d-flex">
                        <div className="mr-2">
                            <Link
                                className={`badge badge-danger`}
                                to={`/blog/search?c=${item.category_title}`}>
                                {item.category_title}
                            </Link>

                            <br/>

                            <span className="text-muted">
                                {item.published_at.day}&nbsp;
                                {getMonth(item.published_at.month)}&nbsp;
                                {item.published_at.year}
                            </span>
                        </div>
                    </div>

                </div>
                <Link
                    to={`/articles/${item.slug}`}
                    style={{
                        // height: "60px"
                    }}
                >
                    <h4 className={"text-dark"}>{_.truncate(item.title, {length: 45})}</h4>
                </Link>
                <p className="flex-grow-1"
                   style={{
                       height: "90px",
                   }}
                   dangerouslySetInnerHTML={{
                       __html: _.truncate(item.excerpt, {length: 150})
                   }}
                />
                <div className="d-flex align-items-center mt-3">
                    <div className="ml-1">
                        <span className="text-small text-muted">Ecrit par</span>
                        &nbsp;
                        <span className="text-small">{item.author.name}</span>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default CardArticle;