import React, { useState } from "react";
import ReplyBox from "./ReplyBox.jsx";
import "./Comment.css";

const countChildren = (comment) => {
    const sub = comment.comments;
    if (!sub || sub.length === 0) {
        return 0;
    }

    let count = 0;
    for (const c of sub) {
        count += countChildren(c) + 1;
    }

    return count;
};

const Comment = ({ comment, reply }) => {
    const [hidden, setHidden] = useState(false);

    const childrenCount = countChildren(comment) + 1;

    return (
        <div className="Comment">
            <div className="Comment-header">
                <span className="Comment-user"> {comment.user} </span>{" "}
                <span className="Comment-points">
                    {comment.points + " points"}
                </span>{" "}
                <span className="Comment-time"> {comment.time} </span>{" "}
                <span
                    className="Comment-hide"
                    onClick={() => setHidden(!hidden)}
                >
                    [{hidden ? "+" + childrenCount : "-"}]
                </span>{" "}
            </div>
            {!hidden && (
                <>
                    <div>
                        <div className="Comment-content">{comment.content}</div>
                        <div className="Comment-footer">
                            {reply.replyParent === comment.id ? (
                                <ReplyBox
                                    parentId={comment.id}
                                    onReply={() => reply.setReplyParent(null)}
                                />
                            ) : (
                                <button
                                    className="Comment-reply-btn"
                                    onClick={() =>
                                        reply.setReplyParent(comment.id)
                                    }
                                >
                                    reply
                                </button>
                            )}
                        </div>
                    </div>
                    {comment.comments && (
                        <CommentList
                            comments={comment.comments}
                            reply={reply}
                        ></CommentList>
                    )}
                </>
            )}
        </div>
    );
};

const CommentList = ({ comments, reply }) => {
    return (
        <div className="CommentList">
            {comments.map((c) => (
                <Comment key={c.id} comment={c} reply={reply}></Comment>
            ))}
        </div>
    );
};

const CommentBox = ({ questionId, comments }) => {
    const [replyParent, setReplyParent] = useState(null);

    return (
        <>
            <ReplyBox
                parentId={questionId}
                isParentQuestion={true}
                onReply={() => {}}
            />
            <CommentList
                comments={comments}
                reply={{ replyParent, setReplyParent }}
            ></CommentList>
        </>
    );
};

export { Comment, CommentList, CommentBox };
