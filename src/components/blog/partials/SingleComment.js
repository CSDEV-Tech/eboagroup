import React, {useState} from "react";
import {getPath} from "../../../actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTimes, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Tooltip from "react-simple-tooltip";
import _ from "lodash";

const SingleComment = ({comment, isSignedIn, userId, deleteComment, updateComment, isLoading}) => {
    const [content, setContent] = useState(comment.content);
    const [editing, setEditing] = useState(false);

    return (
        <>
            <li className="comment mb-4">
                <div className="d-flex align-items-center text-small">
                    {
                        comment.author.avatar ? (
                            <img src={`${getPath(comment.author.avatar, 'blog')}`}
                                 alt={comment.author.name}
                                 className="avatar-comment avatar-sm mr-2"/>
                        ) : (
                            <div
                                className={
                                    "text-primary-dark text-center avatar-comment avatar-sm mr-2 bg-dark text-light" +
                                    " d-table-cell align-middle"}
                                style={{
                                    fontSize: "1rem",
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    height: "100%",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}>
                                    <FontAwesomeIcon icon={faUser}/>
                                </div>
                            </div>
                        )
                    }


                    <div
                        className="text-dark mr-1 text-capitalize">
                        {userId === comment.author.user_related.id ? (<b>Moi</b>) : (
                            <b>{comment.author.user_related.first_name} <span
                                className="text-uppercase">{comment.author.user_related.last_name}</span></b>
                        )}

                    </div>
                    <div
                        className="text-muted">
                        {moment(`${comment.get_date.year}-${comment.get_date.month}-${comment.get_date.day} ${comment.get_date.hours + ":" + comment.get_date.minutes + ":" + comment.get_date.seconds}`, "YYYY-MM-DD h:m:s").fromNow()}
                    </div>
                    &nbsp;&nbsp;
                    {
                        isSignedIn && (userId === comment.author.user_related.id) && (
                            <div>
                                <Tooltip
                                    content="Supprimer le commentaire"
                                    customCss={`white-space: nowrap;`}
                                >
                                    <button
                                        className="btn btn-sm btn-danger small-btn"
                                        onClick={deleteComment}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </Tooltip>{" "}
                            </div>
                        )}
                    &nbsp;&nbsp;
                    {
                        isSignedIn && (userId === comment.author.user_related.id) && (
                            <div>
                                <Tooltip
                                    content={editing ? "Annuler la modification" : "Modifier le commentaire"}
                                    customCss={`white-space: nowrap;`}
                                >
                                    <button
                                        className={`btn btn-sm ${editing ? "btn-secondary" : "btn-primary"} small-btn`}
                                        onClick={() => {
                                            editing && setContent(comment.content);
                                            setEditing(!editing);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={!editing ? faEdit : faTimes}/>
                                    </button>
                                </Tooltip>{" "}
                            </div>
                        )}
                </div>
                {
                    !editing ? (
                        <div className="my-2 p-3"
                             style={{
                                 border: '2px solid #dee2e6',
                                 borderRadius: '5px',
                                 fontSize: '1.3rem'
                             }}
                             dangerouslySetInnerHTML={{
                                 __html: _.replace(comment.content, '\n', '<br/>')
                             }}
                        />
                    ) : (
                        <form className={"m-2"} onSubmit={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            updateComment(content);
                            setEditing(false);
                        }}>
                            <textarea
                                className={"form-control"}
                                rows="3"
                                onChange={(ev) => setContent(ev.target.value)}
                                value={content}
                            />

                            <button
                                className={`btn mt-2 btn-primary ${isLoading &&
                                "disabled"}`}
                                type="submit"
                                disabled={isLoading}
                            >
                                Modifier
                            </button>
                        </form>
                    )
                }
            </li>
        </>
    );
};

export default SingleComment;