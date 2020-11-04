import React, {useState} from "react";

const CommentForm = ({isLoading, onSubmit}) => {
    const [content, setContent] = useState("");

    return (
        <>
            <h5 className="my-4">Commenter</h5>
            <form onSubmit={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setContent("");
                onSubmit(content);
            }}>
                <div className="form-group">
                    <textarea className="form-control" name="comment-text" rows="7"
                              placeholder="Commentaire"
                              value={content}
                              onChange={(ev) => setContent(ev.target.value)}
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <button
                        className={`btn  btn-primary ${isLoading || content.length === 0 &&
                        "disabled"}`}
                        type="submit"
                        disabled={isLoading || content.length === 0}
                    >
                  <span className="d-flex flex-row align-items-center">
                    Soumettre{" "}
                      {isLoading && <span className="spinner spinner-grow"/>}
                  </span>
                    </button>
                </div>
            </form>
        </>
    )
};

export default CommentForm;